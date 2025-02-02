'use client'
import { useEffect, useState } from 'react'

type Interval = {
    from: string
    to: string
    timeframe: string
}

type Quote = {
    currency: string
    exchange: string
    date: string
    datetime: string
    price: number
    isin: string
    cachedAt?: string
    originalCurrency?: string
    fxRate?: number
}

type PerformanceDetails = {
    invested: number
    value: number
    gainGross: number
    gainNet: number
    returnGross: number
    returnNet: number
}

export type Performance = PerformanceDetails & {
    since: string
    totalGainGross: number
    totalGainNet: number
    totalReturnGross: number
    totalReturnNet: number
    priceAtIntervalStart: number
    valueAtIntervalStart: number
    sharesAtIntervalStart: number
    purchaseValueForInterval: number
    purchaseValue: number
    cashflow: number
    taxes: number
    fees: number
    izf: number
    ttwror: number
    unrealized: PerformanceDetails
    realized: PerformanceDetails
    interest: PerformanceDetails & { taxes: number; fees: number }
    dividends: PerformanceDetails & { taxes: number; fees: number }
}

type Position = {
    shares: number
    purchasePrice: number
    purchaseValue: number
    currentPrice: number
    currentValue: number
    isSold: boolean
}

type Asset = {
    identifier: string
    assetType: string
}

type SharedAsset = {
    _id: Asset
    assetType: string
    name: string
    logo: string
    security: {
        website: string
        type: string
        wkn: string
        isin: string
    }
}

export type Holding = {
    _id: string
    portfolio: string
    assetType: string
    currency: string
    user: string
    hashedAccountNumber: string | null
    logo: string
    earliestActivityDate: string
    quote: Quote
    startQuote: Quote
    performance: Performance
    position: Position
    exchange: string
    security: string
    asset: Asset
    activityCount: number
    sharedAsset: SharedAsset
    currencyAdjusted: boolean
    futureDividends: never[]
    dividendGrowth: Record<
        string,
        {
            grossAmount: number
            netAmount: number
            netChangeYoY: number
            grossChangeYoY: number
        }
    >
    userHints: { hasActivityInconsistencies: boolean }
}

type FutureDividend = {
    type: string
    security: string
    price: number
    currency: string
    date: string
    datetime: string
    exShares: number
    grossAmount: number
    originalPrice: number
    originalCurrency: string
    paymentDate: string
    declarationDate: string
    recordDate: string
    exDate: string
    isEstimated: boolean
    fxRate: number
    originalAmount: number
}

type Allocation = Record<string, number>

type DividendGrowth = Record<
    string,
    {
        grossAmount: number
        netAmount: number
        netChangeYoY: number
        grossChangeYoY: number
    }
>

type StockData = {
    interval: Interval
    holdings: Holding[]
    activities: never[]
    performance: Performance
    futureDividends: FutureDividend[]
    allocation: Allocation
    dividendGrowth: DividendGrowth
}

export const useGetStockData = (url: string) => {
    const id = url.split('/').filter(Boolean).pop()

    const [data, setData] = useState<StockData>()
    useEffect(() => {
        fetch('https://api.parqet.com/v1/portfolios/assemble', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                portfolioIds: [id],
                holdingId: [],
                assetTypes: [],
                timeframe: 'max',
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(setData)
    }, [])
    return { data }
}
