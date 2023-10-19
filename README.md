# Realtime Chat App built with React, TypeScript, Bootstrap, Firebase Authentication & Firestore deployed on Vercel

This app is a part of a wider experiment: I'm building same chat app a few times with different technologies:

- React,
- Svelte,
- Vue.

## Motivation

I've decided to build the same app in React, Svelte & Vue for 2 reasons:

- I had a chat app for long on my todo apps list,
- I'm recently messing around with Svelte/SvelteKit & Vue to do/learn something new & refreshing after coding in React for more than 2 years and in Next.js for a year (at the moment of writing this in October 2023), so I've decided to deeply compare the possibilities and developer experience of all of mentioned technologies and I think there's no better way than to do this by developing same real world app in those.

## Common features of the 3 applications

Despite all 3 chat apps will be built in different main technologies (React, Svelte, Vue), they will share a lot of common features, concepts and technologies:

- TypeScript
- Firebase (all apps will share same Firebase project)
  - Authentication (using Google Provider)
  - Firestore
- pure CSS/ styles (all apps will have same appearance & the only difference will be that each app will have the technology related color scheme to distinguish them at one glance)
- app structure & a lot of shared code

## Start from React

I've decided to start building 3 identical apps from React for a few reasons:

- I'm using this technology for more than 2,5 years, I've built a tone of projects with it & done all things I will need in this project already.
- My few last projects were written in Svelte & Vue, so it's good to come back to React to refresh my skills.
- I personally think, that developing this app in React will be more time consuming than in Svelte or Vue, but that's just a hypothesis.

So the React version of the chat app will be the foundation and the codebase to use in Svelte & Vue versions, which will enable focusing only on implementing different concepts/features in a specific way in Svelte and Vue - technologies I'm not so familiar yet.

## Tech Stack

- **React 18.2.0** (I've used CRA PWA TS template to init this project)
- **React Router 6.16**
- **TypeScript 4.9.5**
- **Firebase 10.5.0**
- **Bootstrap 5.3.2**
- **React Bootstrap 2.9.0**
- **React Icons 4.11.0**