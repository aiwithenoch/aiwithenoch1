# Camera Director

Free browser-based 3D cinematography and pose-composition studio.

## Features

- Interactive shot camera, lens, orbit, elevation, distance and bird's-eye controls
- One or two articulated human mannequins
- Direct joint manipulation with 3-axis rotation gizmos
- Pose Studio with Default, Alert, Crouching, Fallen, Fight, Kneeling, Pistol kneeling, Sad, Sleeping and additional presets
- Save reusable custom poses
- PNG reference, project JSON and articulated GLB export
- ChatGPT image-generation handoff
- MCP endpoint at `/mcp`

## Local development

Serve this folder with any static server, for example:

```bash
python3 -m http.server 8787
```

Open `http://localhost:8787`.
