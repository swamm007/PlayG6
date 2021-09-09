import { Graph } from "@antv/g6"
import { useEffect, useRef } from "react"
import { initG6 } from './util'

const record = {
	nodes: [
		{ id: 'node1',  label: 'number1' },
		{ id: 'node2',  label: 'number2' }
	]
}

const G6Demo01: React.FC = () => {

	const g6Instance = useRef<Graph>()

	const g6Wrapper = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!g6Instance.current) {
			g6Instance.current = initG6(g6Wrapper)
			// 渲染数据
			g6Instance.current.data(record)
			g6Instance.current.render()
		}
	})

	return <div style={{width: "100%", height: "100%", background: "#e7e7e7"}} ref={g6Wrapper}>

	</div>
}
export default G6Demo01