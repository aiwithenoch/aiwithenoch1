# Camera Director

A free browser-based 3D camera and shot-composition studio with poseable human mannequins and a lightweight MCP endpoint for ChatGPT.

## Poseable human models

- Human-style procedural mannequins with articulated joint hierarchies
- Click a glowing joint to select it
- Drag the red, green and blue rotation rings to pose that joint
- Move the entire mannequin across the floor with X/Z translation arrows
- Adjustable head, spine, shoulders, elbows, wrists, hips, knees and ankles
- Built-in pose presets and precise joint sliders
- Joint rotations are preserved in project JSON and GLB exports

## Camera and shot tools

- Shot view and bird's-eye view
- Medium, wide, close-up, low-angle, high-angle, over-the-shoulder and two-shot presets
- Lens/FOV, camera orbit, elevation and distance controls
- Rule-of-thirds guides
- Automatic cinematography prompt generation
- PNG composition-reference export
- GLB 3D scene export
- JSON project save/load
- ChatGPT handoff using widget file upload and follow-up messaging

## Deployment

- Website: `/`
- MCP endpoint: `/mcp`
- Serverless handler: `/api/mcp`

The compressed application payload lives under `payload/`. Both the public web loader and the deployed MCP endpoint read the same GitHub-hosted payload, keeping the website and ChatGPT widget synchronized.

## Notes

The included model is a poseable procedural mannequin intended for shot blocking and image references. It is not a photorealistic body scan or a reconstruction of a real person.
