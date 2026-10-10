"""
Decentralized Verifiable AI Network - WebSocket Connection Manager
Provides real-time pub/sub event broadcasting to connected frontend clients:
- Training round lifecycle (init, epoch progress, convergence)
- zkML proof synthesis & cryptographic constraints
- Arbitrum L2 verification events
- Solana dynamic token incentive disbursements
- Byzantine outlier rejection & FedAvg parameter updates
"""

import asyncio
import time
from typing import Dict, List, Any, Optional
from fastapi import WebSocket


class TrainingWebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._send_lock: Optional[asyncio.Lock] = None

    def _get_send_lock(self) -> asyncio.Lock:
        if self._send_lock is None:
            self._send_lock = asyncio.Lock()
        return self._send_lock

    def set_loop(self, loop: asyncio.AbstractEventLoop):
        self._loop = loop

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        try:
            await websocket.send_json({
                "event": "WS_CONNECTED",
                "timestamp": time.time(),
                "data": {
                    "status": "ONLINE",
                    "message": "Connected to FedZero Coordinator WebSocket Telemetry Stream",
                    "active_subscribers": len(self.active_connections),
                },
            })
        except Exception:
            self.disconnect(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            try:
                self.active_connections.remove(websocket)
            except ValueError:
                pass

    async def broadcast(self, event_type: str, data: Dict[str, Any]):
        """Asynchronously send an event frame to all connected clients under a lock."""
        payload = {
            "event": event_type,
            "timestamp": time.time(),
            "data": data,
        }
        lock = self._get_send_lock()
        async with lock:
            to_remove = []
            for connection in list(self.active_connections):
                try:
                    await connection.send_json(payload)
                except Exception:
                    to_remove.append(connection)
            for conn in to_remove:
                self.disconnect(conn)

    def broadcast_sync(self, event_type: str, data: Dict[str, Any]):
        """
        Thread-safe synchronous broadcaster.
        Allows synchronous services (like orchestrator.execute_live_round)
        to publish real-time events without needing async/await syntax everywhere.
        """
        if not self.active_connections:
            return

        try:
            loop = self._loop
            if loop is None or loop.is_closed():
                loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            asyncio.run_coroutine_threadsafe(self.broadcast(event_type, data), loop)
        else:
            try:
                new_loop = asyncio.new_event_loop()
                new_loop.run_until_complete(self.broadcast(event_type, data))
                new_loop.close()
            except Exception:
                pass


ws_manager = TrainingWebSocketManager()
