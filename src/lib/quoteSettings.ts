import {quotes} from "$lib/quotes";

export const bannedPhrases = [
    "never back down",
    "back down",
    "life is roblox"
]

export type Quote = {
    quote: string,
    author: string,
    request?: string
    quoteNumber?: number
};

export type QuoteRequestMetadata = {
    quotePreview: string,
    authorPreview: string,
    status: string,
    reason: string,
    expiration: number,
    submitted: number
}

export type QuoteRequestValue = {
    quote: string,
    author: string,
    note: string,
    similarQuotes: {
        similarity: number,
        quote: Quote
    }
}