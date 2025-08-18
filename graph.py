import json
import pydot
import sys

def draw_roadmap(json_file, output_file="roadmap.png"):
    # Load JSON
    with open(json_file, "r") as f:
        data = json.load(f)

    # Create directed graph
    graph = pydot.Dot(graph_type="digraph", rankdir="TB", splines="ortho")

    # Color map by level
    color_map = {
        "beginner": "lightyellow",
        "intermediate": "lightblue",
        "advanced": "lightpink"
    }

    # Add nodes
    nodes = {}
    for topic, details in data.items():
        level = details.get("level", "beginner")
        fillcolor = color_map.get(level, "white")
        node = pydot.Node(
            topic,
            shape="box",
            style="rounded,filled",
            fillcolor=fillcolor,
            fontsize="12",
            width="2.5",
            height="0.8"
        )
        graph.add_node(node)
        nodes[topic] = node

    # Add edges
    for topic, details in data.items():
        prereq = details.get("prerequisite")
        if prereq and prereq in nodes:
            edge = pydot.Edge(nodes[prereq], nodes[topic], arrowsize="0.7")
            graph.add_edge(edge)

    # Save as PNG
    graph.write_png(output_file)
    print(f"✅ Roadmap saved as {output_file}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 graph.py <json_file> [output_file.png]")
    else:
        json_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else "roadmap.png"
        draw_roadmap(json_file, output_file)
