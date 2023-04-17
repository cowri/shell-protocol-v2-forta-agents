# Shell V2 Forta Agents

## Description

Currently there is 1 agent which detects large amounts of wrapping, unwrapping or swapping

## Alerts

Describe each of the type of alerts fired by this agent

  - SHELL-V2-1
  - Fired when a transaction contains any erc20 wrapping over 1000 tokens
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-2
  - Fired when a transaction contains any erc20 unwrapping over 1000 tokens
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-3
  - Fired when a transaction contains any erc1155 wrapping over 100 tokens
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-4
  - Fired when a transaction contains any erc1155 unwrapping over 100 tokens
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-5
  - Fired when a transaction contains a ether wrapping over 25 eth
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-6
  - Fired when a transaction contains a ether unwrapping over 25 eth
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-7
  - Fired when a transaction contains a input amount being swapped over 25 eth or 1000 tokens or compute output amount event
  - Severity is always set to "low" (mention any conditions where it could be something else)

  - SHELL-V2-8
  - Fired when a transaction contains a input amount being swapped over 25 eth or 1000 tokens for compute input amount event
  - Severity is always set to "low" (mention any conditions where it could be something else)

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x5cb4ebff2438f783a71332474d78f831c6d73b37ab4ac515e1c7d028d4850707 (large arb transfer)