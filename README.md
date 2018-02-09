# Ethereum Smart Contract + Gambling Game

## Stack
   1. node.js
   2. react.js / redux
   3. sockjs
   4. mongodb

## Key Features
   1. Ticket Management 
      - Ticket has own number which will be matched for choosing winner.
      - User buy tickets with tokens that paid by Ethereum.
   2. ERC20 smart contract 
      - built with solidty, sell tokens to users by Ethereum when joining game
   3. Game Logic 
      
      - It get started when room is full or after certain time passed.
      - Game core module generate a random ticket number among of sold tickets.
      - User who has the ticket will be winner, thus the probability of winning is bigger as you get more tickets. 
