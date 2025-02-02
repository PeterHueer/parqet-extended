'use client'
import { useState } from 'react'
import Stocks from '@/app/stocks'

export default function Home() {

    const [id, setId] = useState<string>()

    if (id) {
        return <Stocks id={id} />
    }

    return (
        <div className="grid min-h-screen place-items-center">
            <div className="w-full max-w-2xl">
                <h1>Paste your parqet URL here</h1>
                <input
                    type="text"
                    placeholder="For example: https://app.parqet.com/p/a1234d4tf43e31a"
                    className="input input-bordered input-lg input-primary w-full"
                    onChange={({ currentTarget }) => {
                        const url = currentTarget?.value
                        const isValid =
                            /^https:\/\/app\.parqet\.com\/p\/[a-f0-9]{24}$/.test(
                                url
                            )

                        const id = url.split('/').filter(Boolean).pop()
                        if (isValid && id) {
                            setId(id)
                        }
                    }}
                />
            </div>
        </div>
    )
}
