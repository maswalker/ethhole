import human from 'millify'

import chainData from '../data/data'
import { ETH_BRIDGE_CONTRACTS } from '../data/bridge_contracts.js'

// import { TotalValueLocked } from '../components/TotalValueLocked'
import { Panel } from '../components/Panel'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { TokensTable } from '../components/TokensTable'
import { TokenTableRow } from '../components/TokenTableRow'

export const Project = ({proj}) => {
  const projMeta = ETH_BRIDGE_CONTRACTS[proj]
  // const tvl = price === 1 ? `Ξ ${human(project.tvl)}` : `$ ${human(project.tvl * price)}`
  const price =  chainData.ethereum.usd
  const symbol = '$' //price !== 1 ? 'Ξ' : '$'
  return (
    <>
      <Nav ethUsdPrice={price}/>
      <Panel>
        <h1>{projMeta.color && (<div className="flex flex-row flex-shrink-0">
          <a href={projMeta.website} target="_blank" className="block relative pr-2" style={{color: projMeta.color}} rel="noreferrer">
              ●
          </a> {proj}
        </div>)}</h1>
      </Panel>
      {chainData[proj].bridges.map((bridge, idx) => {
        // console.log('%O', bridge)
        return (
          <Panel key={idx}>
            <h2>Bridge {bridge.name || idx + 1}</h2>
            <TokensTable>
            {bridge.items.filter(item => item.quote > 1).map(item => {
              console.log('%O', item)
              return (
                <TokenTableRow token={item.contract_ticker_symbol} sum={`${symbol} ${human(item.quote * price)}`} />
              )
            })}
            </TokensTable>
          </Panel>
        )
      })}
      <Footer/>
    </>
  )
}