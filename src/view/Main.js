import { useState } from "react"
import { navigate } from 'hookrouter'

import { useChainData } from '../hooks/useChainData'
import { TotalValueTracked } from '../components/TotalValueTracked'
import { ProjectsTable } from '../components/ProjectsTable'
import { ProjectTableRow } from '../components/ProjectTableRow'
import { Panel } from '../components/Panel'
import { BalanceFlow } from '../components/BalanceFlow'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { ETH_BRIDGE_CONTRACTS, TYPE_SIDECHAIN } from '../data/bridge_contracts'

const FILTEROUT = ['ethereum', 'fuse']
// console.log('%O', chainData)
export const Main = ({layer2}) => {
  const [chainData, timestamp] = useChainData()
  const [showEth, setShowEth] = useState(false)

  const toggleValue = () => setShowEth(!showEth)
  const projects = Object.keys(chainData)
  .filter(proj => !FILTEROUT.includes(proj))
  // layer 2 strict mode
  .filter(proj => !layer2 || ETH_BRIDGE_CONTRACTS[proj].type !== TYPE_SIDECHAIN)
  .sort((a, b) => chainData[b].tvl - chainData[a].tvl)
  // console.log('projects %O', projects)

  const price = showEth ? 1 : chainData?.ethereum?.usd || 1
  const symbol = showEth ? 'ETH' : 'USD'
  const tvl = projects.reduce((a,c) => a + chainData[c].tvl, 0)
  const toggleStrictMode = () => layer2 ? navigate('/') : navigate('/layer2')

  return (<>
    <Nav ethUsdPrice={price} timestamp={timestamp} />
    <Panel>
      <BalanceFlow projects={projects} data={chainData} price={price} layer2={layer2} />
    </Panel>
    <Panel>
      <TotalValueTracked projects={projects} tvl={tvl} price={price} >
        <div className="mb-3 pr-2">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" name="toggle" id="eth" onChange={toggleValue} checked={showEth} className="checked:bg-purple-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label htmlFor="eth" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
            </label>
          </div>
          <span className="text-gray-400 font-medium">
            {symbol} Equivalent
          </span>
        </div>
        <div className="mb-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" name="toggle" id="strict" onChange={toggleStrictMode} checked={layer2} className="checked:bg-purple-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label htmlFor="strict" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
            </label>
          </div>
          <span className="text-gray-400 font-medium">
            Strict Mode
          </span>
        </div>
      </TotalValueTracked>
    </Panel>
    <Panel>
      <ProjectsTable>
        {projects.map(proj => <ProjectTableRow key={proj} price={price} name={proj} data={chainData} />)}
      </ProjectsTable>
    </Panel>
    <Footer/>
  </>)
}
