import G6 from '@antv/g6'
import { useEffect, useRef } from 'react';
// import {} from '@antv/g6-react-node'
// const {}  = G6
/**
 * 
 * @returns 今日目标 
 * 1、 完成自定义节点按照设计稿 √
 * 2、支持里面相应位置的点击事件 暂时√
 * 3、完成两个节点可以生成边并连接起来
 * 4、表单提交后怎么更改状态
 * 
 */
const registerG6Node = () => {
  G6.registerNode('rect-node', {
    jsx: (cfg) => {
      const width = 100;
      const stroke = '#096dd9';
      return `
      <group>
        <rect draggable="true" style={{width: ${width}, height: 42, stroke: ${stroke}, radius: 4}} keyshape>
          <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>${cfg.label}</text>
          <text style={{ marginLeft: ${width - 16
        }, marginTop: -20, stroke: '#66ccff', fill: '#000', cursor: 'pointer', opacity: ${cfg.hover ? 0.75 : 0
        } }} action="add">+</text>
        </rect>
      </group>
    `;
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  }, 'single-node')
}
registerG6Node()
// 此处可以用@antv/g6-react-node替代，效果更好
const registerSettingNode = () => {
  G6.registerNode('set-node', {
    jsx: (cfg) => {
      return `
        <group draggable=true>
          <rect
            draggable=true
            style={{width: 250,height: 150,radius: [6,6,6,6], fill: '#f60',marginTop: 20}}
          >
            <text
              style={{
                textAlign: 'left',
                fontWeight: bold,
                fill: '#fff', 
                width: 250, 
                lineHeight: 40,
                marginTop: 20,
                marginLeft: 20
              }}
              name='title'
            >${cfg.label}</text>
            <text
              style={{
                textAlign: 'left',
                fontWeight: bold,
                fill: '#fff', 
                width: 250, 
                lineHeight: 40,
                marginTop: 20,
                marginLeft: 20
              }}
              name='title'
            >编辑节点: </text>
            <text name='add' style={{cursor: 'pointer', fontSize: 20}} action='add'>+</text>
            <text name='minus' style={{cursor: 'pointer', fontSize: 20}} action='edit'>-</text>
            <circle style={{r: 10, fill: 'green', marginLeft: 0, marginTop: 20}}></circle>
            <circle style={{r: 10, fill: 'green', marginLeft: 250}}></circle>
          </rect>
        </group>
      `
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  }, 'single-node')
  G6.registerBehavior('set-node-event', {
    getEvents() {
      return {
        'node:click': 'clickNode',
      };
    },
    clickNode(evt: any) {
      const model = evt.item.get('model');
      const name = evt.target.get('action');
      console.log('kaishi kaishi ')
      switch (name) {
        case 'add':
          console.log('123add', model, name)
          break;
        case 'delete':
          console.log('123', model, name)
          break;
        case 'edit':
          console.log('123edit', model, name)
          break;
        default:
          return;
      }
    }
  });
}
registerSettingNode()
const data = {
  nodes: [
    { id: 'node1', x: 350, y: 100, label: '这是第一个文字', node: 'set-node' },
    { id: 'node2', x: 350, y: 250, label: '这是第2个文字' },
    { id: 'node3', x: 350, y: 250, label: '这是第3个文字' },
  ],
  edges: [
    {
      id: 'edge1',
      target: 'node2',
      source: 'node1',
    },
    {
      id: 'edge2',
      target: 'node3',
      source: 'node2',
    },
  ],
};
let sourceAnchorIdx: any, targetAnchorIdx: any
const G6Test: React.FC = () => {
  const container = useRef(null)
  let graph: any = null
  useEffect(() => {
    if (!graph) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
        container: container.current! as HTMLElement,
        width: 800,
        height: 800,
        layout: {
          type: 'dagre', // 布局类型
          rankdir: 'RL', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
          nodesep: 200,
          ranksep: 100
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'set-node-event', 'create-edge']
        },
        defaultNode: {
          type: 'set-node',
          style: {
            fill: '$f60',
            stroke: '#000',
          }
        },
        defaultEdge: {
          type: 'quadratic',
          style: {
            stroke: '#F6BD16',
            lineWidth: 2,
          },
        },
      });
    }
    graph.data(data);
    graph.render();
    // graph.on('node:click', (evt: any) => {
    //   const model = evt.item.get('model');
    //   const name = evt.target.get('action');
    //   console.log('model=', model, 'name=', name)
    // })
  }, [])
  console.log(targetAnchorIdx, sourceAnchorIdx);

  return <div ref={container}></div>
}
export default G6Test