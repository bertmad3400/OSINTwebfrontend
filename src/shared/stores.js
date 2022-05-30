import { writable } from 'svelte/store';
import { appConfig } from "./config.js"

export const feeds = writable(structuredClone(appConfig.feeds));

export const articles = writable({})

export const state = writable(structuredClone(appConfig.defaultOptions.state))

export const modalState = writable(structuredClone(appConfig.defaultOptions.modalState))

export const loginState = writable(structuredClone(appConfig.defaultOptions.loginState))

export const currentSearch = writable(structuredClone(appConfig.defaultOptions.search))

export const collectionList = writable(null)
export const collectionArticles = writable({})
