import json
from collections import deque

# pip install nothing - standard library only

FLOOR_PLAN_PATH = "floor_plan.json"


def load_floor_plan() -> dict:
    with open(FLOOR_PLAN_PATH, "r") as f:
        return json.load(f)


def resolve_destination(floor_plan: dict, spoken_destination: str) -> str | None:
    """
    Converts a spoken destination string (e.g. "washroom") to a node ID.
    Returns None if not found.
    """
    return floor_plan["destinations"].get(spoken_destination)


def resolve_qr(floor_plan: dict, qr_string: str) -> str | None:
    """
    Converts a scanned QR string (e.g. "ACCESSIBLE_NAV::NODE_FRONT_DOOR") to a node ID.
    Returns None if not recognized.
    """
    return floor_plan["qr_codes"].get(qr_string)


def get_path(floor_plan: dict, start_node: str, end_node: str) -> list[str] | None:
    """
    BFS shortest path from start_node to end_node.
    Returns ordered list of node IDs, or None if no path exists.
    """
    if start_node == end_node:
        return [start_node]

    # Build adjacency map from edges
    adjacency = {}
    for edge in floor_plan["edges"]:
        adjacency.setdefault(edge["from"], []).append(edge["to"])

    # BFS
    queue = deque([[start_node]])
    visited = {start_node}

    while queue:
        path = queue.popleft()
        current = path[-1]

        for neighbor in adjacency.get(current, []):
            if neighbor == end_node:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])

    return None  # no path found


def get_next_instruction(floor_plan: dict, from_node: str, to_node: str) -> str | None:
    """
    Returns the instruction string for the edge between two adjacent nodes.
    """
    for edge in floor_plan["edges"]:
        if edge["from"] == from_node and edge["to"] == to_node:
            return edge["instruction"]
    return None


def get_arrival_message(floor_plan: dict, node_id: str) -> str:
    """
    Returns the arrival message for a destination node.
    """
    return floor_plan["arrival_messages"].get(node_id, f"You have arrived at {floor_plan['nodes'][node_id]['label']}.")


# --- Quick test ---
if __name__ == "__main__":
    fp = load_floor_plan()

    # Simulate: user said "washroom", scanned QR at front door
    dest_node = resolve_destination(fp, "washroom")
    start_node = resolve_qr(fp, "ACCESSIBLE_NAV::NODE_FRONT_DOOR")

    print(f"Start: {start_node}")
    print(f"Destination: {dest_node}")

    path = get_path(fp, start_node, dest_node)
    print(f"Path: {path}")

    print("\n--- Instructions ---")
    for i in range(len(path) - 1):
        instruction = get_next_instruction(fp, path[i], path[i + 1])
        print(f"  {path[i]} -> {path[i+1]}: {instruction}")
    print(f"  {get_arrival_message(fp, dest_node)}")