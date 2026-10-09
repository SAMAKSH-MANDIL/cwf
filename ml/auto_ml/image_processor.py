import os
import io
import csv
import zipfile
import base64
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from PIL import Image

class ImageDatasetProcessor:
    """
    Converts image files or ZIP archives into tabular feature matrices (CSV)
    for federated training, auto-extracts class labels, and generates visual previews.
    """

    @staticmethod
    def process_images_from_zip(
        zip_bytes: bytes,
        dataset_name: str = "vision_dataset",
        target_size: Tuple[int, int] = (28, 28),
        grayscale: bool = True,
        max_images: int = 1000,
    ) -> Dict[str, Any]:
        """
        Extracts images from a ZIP archive, normalizes pixels, infers labels,
        and outputs a tabular CSV format.
        """
        images_data = []
        labels_map = {}
        thumbnails = []

        with zipfile.ZipFile(io.BytesIO(zip_bytes), "r") as z:
            namelist = [
                n for n in z.namelist()
                if not n.startswith("__MACOSX") and not n.endswith("/")
                and any(n.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".bmp", ".webp"])
            ]

            if not namelist:
                raise ValueError("No valid image files (.png, .jpg, .jpeg, .bmp, .webp) found in ZIP archive.")

            for fname in namelist[:max_images]:
                parts = fname.replace("\\", "/").split("/")
                if len(parts) > 1:
                    raw_label = parts[-2]
                else:
                    base = os.path.splitext(parts[0])[0]
                    raw_label = base.split("_")[0] if "_" in base else "class_0"

                if raw_label not in labels_map:
                    labels_map[raw_label] = len(labels_map)

                label_id = labels_map[raw_label]

                try:
                    img_data = z.read(fname)
                    with Image.open(io.BytesIO(img_data)) as img:
                        processed_vec, thumb_b64 = ImageDatasetProcessor._process_single_image(
                            img, target_size, grayscale
                        )
                        images_data.append((processed_vec, label_id, raw_label))
                        if len(thumbnails) < 16:
                            thumbnails.append({
                                "filename": os.path.basename(fname),
                                "label_name": raw_label,
                                "label_id": label_id,
                                "thumbnail_b64": thumb_b64,
                                "matrix_preview": processed_vec[:16],
                            })
                except Exception:
                    continue

        if not images_data:
            raise ValueError("Failed to process any valid images from archive.")

        return ImageDatasetProcessor._build_dataset_result(
            images_data=images_data,
            labels_map=labels_map,
            thumbnails=thumbnails,
            dataset_name=dataset_name,
            target_size=target_size,
            grayscale=grayscale,
        )

    @staticmethod
    def process_image_files(
        files_data: List[Tuple[str, bytes]],
        dataset_name: str = "vision_dataset",
        target_size: Tuple[int, int] = (28, 28),
        grayscale: bool = True,
    ) -> Dict[str, Any]:
        """
        Processes a list of raw image file bytes (filename, bytes).
        """
        images_data = []
        labels_map = {}
        thumbnails = []

        for fname, raw_bytes in files_data:
            base = os.path.splitext(os.path.basename(fname))[0]
            raw_label = base.split("_")[0] if "_" in base else "sample"

            if raw_label not in labels_map:
                labels_map[raw_label] = len(labels_map)

            label_id = labels_map[raw_label]

            try:
                with Image.open(io.BytesIO(raw_bytes)) as img:
                    processed_vec, thumb_b64 = ImageDatasetProcessor._process_single_image(
                        img, target_size, grayscale
                    )
                    images_data.append((processed_vec, label_id, raw_label))
                    if len(thumbnails) < 16:
                        thumbnails.append({
                            "filename": os.path.basename(fname),
                            "label_name": raw_label,
                            "label_id": label_id,
                            "thumbnail_b64": thumb_b64,
                            "matrix_preview": processed_vec[:16],
                        })
            except Exception:
                continue

        if not images_data:
            raise ValueError("No images could be parsed.")

        return ImageDatasetProcessor._build_dataset_result(
            images_data=images_data,
            labels_map=labels_map,
            thumbnails=thumbnails,
            dataset_name=dataset_name,
            target_size=target_size,
            grayscale=grayscale,
        )

    @staticmethod
    def generate_demo_vision_dataset(
        num_samples: int = 240,
        target_size: Tuple[int, int] = (28, 28),
    ) -> Dict[str, Any]:
        """
        Generates a synthetic medical cellular pathology / ultrasound demo dataset
        (Benign vs Malignant lesion scans) with procedural textures.
        """
        np.random.seed(42)
        images_data = []
        labels_map = {"Benign_Lesion": 0, "Malignant_Cell": 1}
        thumbnails = []

        w, h = target_size
        xx, yy = np.meshgrid(np.linspace(-1, 1, w), np.linspace(-1, 1, h))
        dist_from_center = np.sqrt(xx**2 + yy**2)

        for i in range(num_samples):
            is_malignant = i % 2 == 1
            raw_label = "Malignant_Cell" if is_malignant else "Benign_Lesion"
            label_id = labels_map[raw_label]

            # Generate procedural cellular image
            if is_malignant:
                noise = np.random.normal(0, 0.15, (h, w))
                spikes = 0.3 * np.sin(5 * np.arctan2(yy, xx))
                mask = np.clip(1.0 - (dist_from_center + spikes + noise), 0, 1)
            else:
                noise = np.random.normal(0, 0.05, (h, w))
                mask = np.clip(1.0 - (dist_from_center * 1.3 + noise), 0, 1)

            matrix = np.clip(mask, 0.0, 1.0).astype(np.float32)
            processed_vec = matrix.flatten().round(4).tolist()

            # Render thumbnail
            thumb_img = Image.fromarray((matrix * 255).astype(np.uint8), mode="L")
            buf = io.BytesIO()
            thumb_img.save(buf, format="PNG")
            thumb_b64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

            images_data.append((processed_vec, label_id, raw_label))

            if len(thumbnails) < 16:
                thumbnails.append({
                    "filename": f"scan_{i+1:03d}_{raw_label.lower()}.png",
                    "label_name": raw_label,
                    "label_id": label_id,
                    "thumbnail_b64": thumb_b64,
                    "matrix_preview": processed_vec[:16],
                })

        return ImageDatasetProcessor._build_dataset_result(
            images_data=images_data,
            labels_map=labels_map,
            thumbnails=thumbnails,
            dataset_name="Cellular_Pathology_Vision",
            target_size=target_size,
            grayscale=True,
        )

    @staticmethod
    def _process_single_image(
        img: Image.Image,
        target_size: Tuple[int, int],
        grayscale: bool
    ) -> Tuple[List[float], str]:
        """Resizes, normalizes, and encodes thumbnail."""
        mode = "L" if grayscale else "RGB"
        img_resized = img.convert(mode).resize(target_size, Image.Resampling.BILINEAR)

        arr = np.array(img_resized, dtype=np.float32) / 255.0
        vec = arr.flatten().round(4).tolist()

        thumb_buf = io.BytesIO()
        img_resized.resize((56, 56), Image.Resampling.NEAREST).save(thumb_buf, format="PNG")
        thumb_b64 = "data:image/png;base64," + base64.b64encode(thumb_buf.getvalue()).decode("utf-8")

        return vec, thumb_b64

    @staticmethod
    def _build_dataset_result(
        images_data: List[Tuple[List[float], int, str]],
        labels_map: Dict[str, int],
        thumbnails: List[Dict[str, Any]],
        dataset_name: str,
        target_size: Tuple[int, int],
        grayscale: bool,
    ) -> Dict[str, Any]:
        """Constructs CSV file, summary stats, and returns payload."""
        channels = 1 if grayscale else 3
        features_count = target_size[0] * target_size[1] * channels
        header = [f"px_{i:04d}" for i in range(features_count)] + ["label"]

        rows = []
        class_counts: Dict[str, int] = {}
        for vec, label_id, label_name in images_data:
            rows.append(vec + [label_id])
            class_counts[label_name] = class_counts.get(label_name, 0) + 1

        out_buf = io.StringIO()
        writer = csv.writer(out_buf)
        writer.writerow(header)
        writer.writerows(rows)
        csv_text = out_buf.getvalue()

        clean_name = dataset_name.replace(" ", "_") + ".csv"
        os.makedirs(os.path.join("storage", "datasets"), exist_ok=True)
        storage_path = os.path.join("storage", "datasets", clean_name)
        with open(storage_path, "w", newline="", encoding="utf-8") as f:
            f.write(csv_text)

        preview_rows = [header] + [r for r in rows[:6]]

        return {
            "success": True,
            "dataset_name": dataset_name,
            "filename": clean_name,
            "storage_path": storage_path,
            "total_images": len(images_data),
            "features_count": features_count,
            "target_size": f"{target_size[0]}x{target_size[1]} ({'Grayscale' if grayscale else 'RGB'})",
            "channels": channels,
            "classes": labels_map,
            "class_distribution": class_counts,
            "thumbnails": thumbnails,
            "csv_text": csv_text,
            "preview_rows": preview_rows,
            "csv_size_kb": round(len(csv_text) / 1024, 1),
        }
