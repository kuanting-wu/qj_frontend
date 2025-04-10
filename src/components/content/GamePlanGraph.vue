<template>
    <div class="flex-grow flex flex-col h-full overflow-hidden">
        <!-- Legend for the graph -->
        <div class="flex items-center gap-4 mb-3 text-xs text-gray-600 dark:text-gray-300 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span>Starting Position</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                <span>Ending Position</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
                <span>Both</span>
            </div>
        </div>

        <!-- Graph container -->
        <div class="flex-grow graph-wrapper relative transition-colors duration-300">
            <div id="cy" class="graph-area"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, watch, ref, nextTick, onUnmounted, computed } from "vue";
import Cytoscape from "cytoscape";

export default {
    props: ["gamePlanData"],
    emits: ['position-clicked', 'edge-clicked'],
    setup(props, { emit }) {
        const cy = ref(null);
        const selectedNode = ref(null);
        let resizeObserver = null;
        const isDarkMode = ref(
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        );
        const mousePos = ref({ x: 0, y: 0 });

        const getNodeStyleClass = (type) => {
            const nodeStyles = {
                starting: isDarkMode.value ? "bg-gray-500 text-gray-900" : "bg-gray-300 text-gray-700",
                ending: isDarkMode.value ? "bg-gray-600 text-gray-900" : "bg-gray-400 text-gray-800",
                both: isDarkMode.value ? "bg-gray-700 text-gray-100" : "bg-gray-500 text-gray-900",
                default: isDarkMode.value ? "bg-gray-400 text-gray-900" : "bg-gray-200 text-gray-800",
            };
            return nodeStyles[type?.toLowerCase()] || nodeStyles.default;
        };

        const graphStyles = computed(() => {
            return [
                {
                    selector: "node",
                    style: {
                        label: "data(displayLabel)",
                        "text-valign": "center",
                        "font-size": "12px",
                        "font-weight": "500",
                        "shape": "ellipse",
                        "text-wrap": "wrap",
                        "text-max-width": "50px",
                        "border-width": 1,
                        "border-color": isDarkMode.value ? "#6B7280" : "#D1D5DB",
                        "transition-property": "background-color, border-color",
                        "transition-duration": "200ms",
                    },
                },
                {
                    selector: "node[type='starting']",
                    style: {
                        "background-color": isDarkMode.value ? "#6B7280" : "#D1D5DB",
                        color: isDarkMode.value ? "#E5E7EB" : "#374151",
                    },
                },
                {
                    selector: "node[type='ending']",
                    style: {
                        "background-color": isDarkMode.value ? "#4B5563" : "#9CA3AF",
                        color: isDarkMode.value ? "#E5E7EB" : "#374151",
                    },
                },
                {
                    selector: "node[type='both']",
                    style: {
                        "background-color": isDarkMode.value ? "#374151" : "#6B7280",
                        color: isDarkMode.value ? "#F3F4F6" : "#1F2937",
                    },
                },
                {
                    selector: "node[data.startingTopBottom='top']",
                    style: {
                        "border-color": isDarkMode.value ? "#60A5FA" : "#3B82F6",
                        "border-width": 2,
                    },
                },
                {
                    selector: "node[data.endingTopBottom='top']",
                    style: {
                        "border-color": isDarkMode.value ? "#60A5FA" : "#3B82F6",
                        "border-width": 2,
                    },
                },
                {
                    selector: "node[data.startingTopBottom='bottom']",
                    style: {
                        "border-color": isDarkMode.value ? "#F87171" : "#EF4444",
                        "border-width": 2,
                    },
                },
                {
                    selector: "node[data.endingTopBottom='bottom']",
                    style: {
                        "border-color": isDarkMode.value ? "#F87171" : "#EF4444",
                        "border-width": 2,
                    },
                },
                {
                    selector: "node:selected",
                    style: {
                        "border-width": 3,
                        "border-color": isDarkMode.value ? "#D1D5DB" : "#374151",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 2,
                        "line-color": isDarkMode.value ? "#6B7280" : "#9CA3AF",
                        "target-arrow-color": isDarkMode.value ? "#6B7280" : "#9CA3AF",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        opacity: 0.7,
                        label: "data(label)",
                        "font-size": "10px",
                        color: isDarkMode.value ? "#9CA3AF" : "#6B7280",
                        "text-outline-width": 1,
                        "text-outline-color": isDarkMode.value ? "#1F2937" : "#E5E7EB",
                        "text-wrap": "wrap",
                        "text-max-width": "60px",
                        "z-index": 10,
                        "transition-property": "line-color",
                        "transition-duration": "200ms",
                    },
                },
                {
                    selector: "edge:selected",
                    style: {
                        width: 3,
                        "line-color": isDarkMode.value ? "#D1D5DB" : "#374151",
                        "target-arrow-color": isDarkMode.value ? "#D1D5DB" : "#374151",
                        opacity: 1,
                    },
                },
            ];
        });

        const checkDarkMode = () => {
            if (window.matchMedia) {
                isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
                nextTick(() => renderGraph());
            }
        };

        const renderGraph = () => {
            if (cy.value) {
                cy.value.destroy();
            }

            const container = document.getElementById("cy");
            if (!container) return;

            if (!props.gamePlanData || !props.gamePlanData.posts) {
                console.warn("Game plan data or posts not available:", props.gamePlanData);
                cy.value = initializeCytoscape(container, []);
                return;
            }

            try {
                console.log("Rendering graph with posts:", props.gamePlanData.posts);
                const elements = formatData(props.gamePlanData.posts);
                cy.value = initializeCytoscape(container, elements);
                cy.value.resize();
                cy.value.fit(undefined, 0);
            } catch (error) {
                console.error("Error rendering graph:", error, props.gamePlanData);
                cy.value = initializeCytoscape(container, []);
            }
        };

        const getVisibleBoundingBox = (instance, container) => {
            const containerRect = container.getBoundingClientRect();
            const topLeft = instance.renderer().projectIntoViewport(containerRect.left, containerRect.top);
            const bottomRight = instance.renderer().projectIntoViewport(containerRect.right, containerRect.bottom);
            return {
                x1: topLeft[0],
                y1: topLeft[1],
                x2: bottomRight[0],
                y2: bottomRight[1]
            };
        };

        const initializeCytoscape = (container, elements) => {
            const instance = Cytoscape({
                container,
                elements,
                style: graphStyles.value,
                layout: {
                    name: "cose",
                    idealEdgeLength: 130,
                    nodeRepulsion: 7000,
                    gravity: 0.03,
                    fit: true,
                    padding: 0,
                    animate: true,
                    animationDuration: 500,
                },
                minZoom: 0.5,
                maxZoom: 2.0,
                wheelSensitivity: 0.15,
                boxSelectionEnabled: false,
                autounselectify: false,
                autoungrabify: false,
                userPanningEnabled: true,
                userZoomingEnabled: true,
            });

            container.addEventListener('mousemove', (e) => {
                mousePos.value = { x: e.clientX, y: e.clientY };
            });

            instance.nodes().forEach((node) => {
                const weight = node.data('weight') || 1;
                const minSize = 48;
                const maxSize = 72;
                const maxWeight = Math.max(...instance.nodes().map(n => n.data('weight') || 1), 1);
                const size = minSize + (maxSize - minSize) * (weight / maxWeight);
                node.style('width', size);
                node.style('height', size);

                node.grabify();

                node.on('drag', () => {
                    const nodePos = node.position();
                    const radius = node.width() / 2;
                    const containerRect = container.getBoundingClientRect();
                    const boundingBox = getVisibleBoundingBox(instance, container);

                    if (
                        mousePos.value.x < containerRect.left ||
                        mousePos.value.x > containerRect.right ||
                        mousePos.value.y < containerRect.top ||
                        mousePos.value.y > containerRect.bottom
                    ) {
                        node.ungrabify();
                        node.position({
                            x: Math.max(boundingBox.x1 + radius, Math.min(boundingBox.x2 - radius, nodePos.x)),
                            y: Math.max(boundingBox.y1 + radius, Math.min(boundingBox.y2 - radius, nodePos.y))
                        });
                        setTimeout(() => node.grabify(), 0);
                        return;
                    }

                    node.position({
                        x: Math.max(boundingBox.x1 + radius, Math.min(boundingBox.x2 - radius, nodePos.x)),
                        y: Math.max(boundingBox.y1 + radius, Math.min(boundingBox.y2 - radius, nodePos.y))
                    });
                });
            });

            instance.on('zoom pan', () => {
                const boundingBox = getVisibleBoundingBox(instance, container);
                instance.nodes().forEach(node => {
                    const pos = node.position();
                    const radius = node.width() / 2;
                    node.position({
                        x: Math.max(boundingBox.x1 + radius, Math.min(boundingBox.x2 - radius, pos.x)),
                        y: Math.max(boundingBox.y1 + radius, Math.min(boundingBox.y2 - radius, pos.y))
                    });
                });
            });

            instance.on('tap', 'node', function (event) {
                const node = event.target;
                selectedNode.value = node.id();
                console.log("Node clicked:", node.data());
                const relatedPosts = findPostsForPosition(props.gamePlanData.posts, node.data('position'));
                console.log("Related posts for position:", relatedPosts);
                emit('position-clicked', {
                    position: node.data('position'),
                    topBottom: node.data('startingTopBottom') || node.data('endingTopBottom'),
                    posts: JSON.parse(JSON.stringify(relatedPosts)) // Deep copy to prevent mutation
                });
            });

            instance.on('tap', 'edge', function (event) {
                const edge = event.target;
                const sourceNode = edge.source();
                const targetNode = edge.target();
                console.log("Edge clicked:", { source: sourceNode.data(), target: targetNode.data() });
                const relatedPosts = findPostsForEdge(
                    props.gamePlanData.posts,
                    sourceNode.data('position'),
                    targetNode.data('position'),
                    sourceNode.data('startingTopBottom'),
                    targetNode.data('endingTopBottom')
                );
                console.log("Related posts for edge:", relatedPosts);
                if (relatedPosts.length > 0) {
                    emit('edge-clicked', {
                        source: sourceNode.data('position'),
                        sourceTopBottom: sourceNode.data('startingTopBottom'),
                        target: targetNode.data('position'),
                        targetTopBottom: targetNode.data('endingTopBottom'),
                        posts: JSON.parse(JSON.stringify(relatedPosts)) // Deep copy to prevent mutation
                    });
                }
            });

            return instance;
        };

        const findPostsForPosition = (posts, position) => {
            if (!posts || !position) return [];
            return posts.filter(post =>
                post.startingPosition === position || post.endingPosition === position
            );
        };

        const findPostsForEdge = (posts, source, target, sourceTopBottom, targetTopBottom) => {
            if (!posts || !source || !target) return [];
            return posts.filter(post =>
                post.startingPosition === source &&
                post.endingPosition === target &&
                (sourceTopBottom ? post.startingTopBottom === sourceTopBottom : true) &&
                (targetTopBottom ? post.endingTopBottom === targetTopBottom : true)
            );
        };

        const formatData = (posts) => {
            if (!posts || !Array.isArray(posts) || posts.length === 0) {
                console.warn("No posts provided to format");
                return [];
            }

            const nodeTypes = {};
            const positionPostMap = {};
            const nodes = new Set();
            const edges = [];
            const nodeDetails = {};

            posts.forEach((post) => {
                if (!post) return;

                const postStructure = {
                    startingPosition: "",
                    endingPosition: "",
                    startingTopBottom: "",
                    endingTopBottom: ""
                };

                // Create unique node IDs by combining position and top/bottom
                const startingId = post.startingPosition && post.startingTopBottom
                    ? `${post.startingPosition}-${post.startingTopBottom}`
                    : post.startingPosition;
                const endingId = post.endingPosition && post.endingTopBottom
                    ? `${post.endingPosition}-${post.endingTopBottom}`
                    : post.endingPosition;

                if (startingId) {
                    nodes.add(startingId);
                    nodeTypes[startingId] = nodeTypes[startingId] === 'ending' ? 'both' : 'starting';
                    if (!positionPostMap[startingId]) {
                        positionPostMap[startingId] = [];
                    }
                    positionPostMap[startingId].push(post.id);

                    if (!nodeDetails[startingId]) {
                        nodeDetails[startingId] = {
                            position: post.startingPosition,
                            displayLabel: post.startingTopBottom
                                ? `${post.startingPosition}\n(${post.startingTopBottom})`
                                : post.startingPosition,
                            startingPosition: post.startingPosition || postStructure.startingPosition,
                            startingTopBottom: post.startingTopBottom || postStructure.startingTopBottom,
                            endingPosition: "",
                            endingTopBottom: ""
                        };
                    }
                }

                if (endingId) {
                    nodes.add(endingId);
                    nodeTypes[endingId] = nodeTypes[endingId] === 'starting' ? 'both' : 'ending';
                    if (!positionPostMap[endingId]) {
                        positionPostMap[endingId] = [];
                    }
                    positionPostMap[endingId].push(post.id);

                    if (!nodeDetails[endingId]) {
                        nodeDetails[endingId] = {
                            position: post.endingPosition,
                            displayLabel: post.endingTopBottom
                                ? `${post.endingPosition}\n(${post.endingTopBottom})`
                                : post.endingPosition,
                            startingPosition: "",
                            startingTopBottom: "",
                            endingPosition: post.endingPosition || postStructure.endingPosition,
                            endingTopBottom: post.endingTopBottom || postStructure.endingTopBottom
                        };
                    } else {
                        nodeDetails[endingId].endingPosition = post.endingPosition || postStructure.endingPosition;
                        nodeDetails[endingId].endingTopBottom = post.endingTopBottom || postStructure.endingTopBottom;
                    }
                }

                if (startingId && endingId && startingId !== endingId) {
                    edges.push({
                        data: {
                            id: `edge-${post.id}`,
                            source: startingId,
                            target: endingId,
                            label: post.title || "Untitled",
                            postId: post.id
                        },
                    });
                }
            });

            return [
                ...Array.from(nodes).map((nodeId) => ({
                    data: {
                        id: nodeId,
                        type: nodeTypes[nodeId] || 'default',
                        weight: positionPostMap[nodeId] ? positionPostMap[nodeId].length : 0,
                        ...nodeDetails[nodeId]
                    }
                })),
                ...edges,
            ];
        };

        onMounted(() => {
            if (window.matchMedia) {
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeMediaQuery.addEventListener('change', checkDarkMode);
            }

            nextTick(() => {
                const container = document.getElementById("cy");
                if (container) {
                    renderGraph();
                    resizeObserver = new ResizeObserver(() => {
                        if (cy.value) {
                            cy.value.resize();
                            cy.value.fit(undefined, 0);
                            const boundingBox = getVisibleBoundingBox(cy.value, container);
                            cy.value.nodes().forEach(node => {
                                const pos = node.position();
                                const radius = node.width() / 2;
                                pos.x = Math.max(boundingBox.x1 + radius, Math.min(boundingBox.x2 - radius, pos.x));
                                pos.y = Math.max(boundingBox.y1 + radius, Math.min(boundingBox.y2 - radius, pos.y));
                                node.position(pos);
                            });
                        }
                    });
                    resizeObserver.observe(container);
                } else {
                    console.error("Graph container element not found");
                }
            });
        });

        onUnmounted(() => {
            if (window.matchMedia) {
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeMediaQuery.removeEventListener('change', checkDarkMode);
            }

            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (cy.value) {
                cy.value.destroy();
            }
        });

        watch(
            () => props.gamePlanData,
            () => {
                nextTick(() => renderGraph());
            },
            { deep: true }
        );

        return {
            cy,
            selectedNode,
            findPostsForPosition,
            findPostsForEdge,
            formatData,
            getNodeStyleClass
        };
    },
};
</script>

<style scoped>
.graph-wrapper {
    flex-grow: 1;
    position: relative;
    min-height: 400px;
    overflow: hidden;
    background: linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%);
    border-radius: 12px;
    border: 1px solid #9CA3AF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.dark .graph-wrapper {
    background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
    border: 1px solid #4B5563;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.graph-area {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>