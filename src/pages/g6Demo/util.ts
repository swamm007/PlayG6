import G6, { Edge, IG6GraphEvent } from "@antv/g6"

let sourceAnchorIdx: string | undefined
let targetAnchorIdx: string | undefined

const initG6 = (g6Wrapper: React.RefObject<HTMLDivElement>) => {
	// 自定义节点
	registerG6Node()

	const instance = new G6.Graph ({
			container: g6Wrapper.current!, // 挂载的容器
			width: 1400, // 画布宽度
			height: 756, // 画布高度
			layout: { // 布局方式
				type: 'dagre',
				rankdir: 'LR', // 可选，默认为图的中心
				align: 'UR', // 可选
				nodesep: 120, // 可选
				ranksep: 120, // 可选
				controlPoints: true // 可选
			},
			modes: { // 交互模式
				default: [
					'drag-canvas', // 拖拽画布
					'zoom-canvas', // 缩放画布
					{
						type: 'drag-node',
						shouldBegin: (e) => {
							if (e.target.get('name') === 'anchor-point') return false;
							return true;
						}
					},
					{
						type: 'create-edge',
						trigger: 'drag', // 设置拖拽的时候生成边
						shouldBegin: (e) => {
							// 避免点击其他节点的时候也出现边 点击左边圆也不能被拖拽
							if (e.target && e.target.get('name') !== 'anchor-point') return false;
							console.log('id==', e.target.get('anchorPointIdx'))
							sourceAnchorIdx = e.target.get('anchorPointIdx');
							return true;
						},
						shouldEnd: (e) => {
							// 避免在其他节点上结束的时候也被添加上边 而且两个负载只能链接一次
							if (e.target && e.target.get('name') !== 'anchor-point') return false;
							// 需要判断是否已经链接过了，如果已经链接过则不应继续链接 根据边的数据来判断
							if (e.target) {
								// 不能自己链接自己
								targetAnchorIdx = e.target.get('anchorPointIdx');
								return true;
							}
							targetAnchorIdx = undefined;
							return true;
						}
					}
				]
			},
			defaultNode: {
				type: 'dependency-card'
			},
			defaultEdge: {
				type: 'cubic-horizontal',
				style: {
					stroke: '#006EFF',
					lineWidth: 2,
					endArrow: true,
					cursor: 'pointer'
				}
			}
	})
	// 生成边之后的事件坚挺
	instance.on('afteradditem', e => {
		if (e.item && e.item.getType() === 'edge') {
			if (sourceAnchorIdx) {
				instance.updateItem(e.item, {
					sourceAnchor: sourceAnchorIdx
				});
			}
		}
	})

	// 边链接后的事件监听
	instance.on('aftercreateedge', (e: IG6GraphEvent) => {
    // 更新边的信息
    instance.updateItem(e.edge as Edge, {
      sourceAnchor: sourceAnchorIdx,
      targetAnchor: targetAnchorIdx
    });
  });

	return instance
}
const registerG6Node = () => {
	G6.registerNode('dependency-card', {
		draw: (cfg, group) => {
			const keyshape = group?.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 150,
          height: 100,
					fill: '#f60'
        },
        name: 'kind-rect',
        draggable: true
      });
			// 文字
			group?.addShape('rect', {
				attrs: {
          x:  25,
          y: 30,
          width: 100,
          height: 40,
					fill: '#fff'
        },
        name: 'kind-rect',
        draggable: true
			})
			// 文字
			group?.addShape('text', {
				attrs: {
					x: 75,
					y: 55,
					fill: '#000',
					text: cfg?.label,
					textAlign: 'center',
					cursor: 'pointer'
				},
				name: 'addDependencyBy-edit'
			});
			// 上方锚点
			group?.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 0,
        position: 'left'
      });
			// 上方锚点
			group?.addShape('circle', {
        attrs: {
          x: 75,
          y: 0,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 1,
        position: 'left'
      });
			group?.addShape('circle', {
        attrs: {
          x: 150,
          y: 0,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 2,
        position: 'left'
      });

			group?.addShape('circle', {
        attrs: {
          x: 0,
          y: 100,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 3,
        position: 'right'
      });
			group?.addShape('circle', {
        attrs: {
          x: 75,
          y: 100,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 4,
        position: 'right'
      });
			group?.addShape('circle', {
        attrs: {
          x: 150,
          y: 100,
          r: 5,
          fill: '#fff',
          lineWidth: 1,
          stroke: '#006EFF',
          cursor: 'pointer'
        },
        draggable: true,
        name: 'anchor-point',
        anchorPointIdx: 5,
        position: 'right'
      });
			return keyshape!
		},
		update: undefined,
		afterDraw: undefined,
		getAnchorPoints() {
      return [
        [0, 0],
        [0.5, 0],
        [1, 0],
        [0, 1],
        [0.5, 1],
        [1, 1],
      ];
    },
	})
}


export {
	initG6
}