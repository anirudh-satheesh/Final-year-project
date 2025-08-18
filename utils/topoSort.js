// Simple Topological Sort
const topoSort = (graph, neededTopics) => {
  const visited = new Set();
  const temp = new Set();
  const result = [];

  function visit(node) {
    if (temp.has(node)) throw new Error("Cycle detected");
    if (!visited.has(node)) {
      temp.add(node);
      (graph[node]?.prerequisites || []).forEach(visit);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    }
  }

  neededTopics.forEach(visit);
  return result;
}

export default topoSort;
