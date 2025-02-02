import { Holding, useGetStockData } from '@/app/loader'
import { useMemo } from 'react'
import cn from 'classnames'

export default function Stocks(props: { id: string }) {
    const { data } = useGetStockData(props.id)
    const soldData = useMemo(
        () => data?.holdings.filter(({ position }) => position.isSold),
        [data]
    )
    const getTotalReturnGross = (returnGross: number) => {
        return `${returnGross > 0 ? `↗` : '︎︎↘︎'} ${returnGross.toLocaleString('de-DE')} %`
    }

    const getTodayRealisation = ({
        startQuote,
        quote,
        performance: { realized },
    }: Holding) => {
        const returnGross = quote.price - startQuote.price
        const totalGainGross = (realized.invested * returnGross) / 100

        return { totalGainGross, returnGross }
    }

    return (
        <div className="flex flex-col p-10">
            <div className="flex flex-wrap justify-center gap-5">
                {soldData?.map((holding) => (
                    <div
                        className="stats shadow stats-vertical max-w-md"
                        key={holding._id}
                    >
                        <div className="stat place-items-center text-center">
                            <div className="stat-title">Aktie</div>
                            <div className="stat-value w-72 truncate">
                                {holding.sharedAsset.name}
                            </div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Realisiert</div>
                            <div
                                className={cn(
                                    'stat-value',
                                    holding.performance.realized.gainGross > 0
                                        ? 'text-success'
                                        : 'text-error'
                                )}
                            >
                                {holding.performance.realized.gainGross.toLocaleString(
                                    'de-DE',
                                    {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }
                                )}
                            </div>
                            <div
                                className={cn(
                                    'stat-desc',
                                    holding.performance.totalGainGross > 0
                                        ? 'text-success'
                                        : 'text-error'
                                )}
                            >
                                {getTotalReturnGross(
                                    holding.performance.realized.returnGross
                                )}
                            </div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Realisiert heute</div>
                            <div
                                className={cn(
                                    'stat-value',
                                    getTodayRealisation(holding)
                                        .totalGainGross > 0
                                        ? 'text-success'
                                        : 'text-error'
                                )}
                            >
                                {getTodayRealisation(
                                    holding
                                ).totalGainGross.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                            </div>
                            <div
                                className={cn(
                                    'stat-desc',
                                    getTodayRealisation(holding)
                                        .totalGainGross > 0
                                        ? 'text-success'
                                        : 'text-error'
                                )}
                            >
                                {getTotalReturnGross(
                                    getTodayRealisation(holding).returnGross
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
