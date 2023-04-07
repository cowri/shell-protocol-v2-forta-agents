import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";

import agent from "./agent";

import {
  OCEAN_ADDRESS,
  ERC20_WRAP_EVENT,
  ERC20_UNWRAP_EVENT,
  ERC1155_WRAP_EVENT,
  ERC1155_UNWRAP_EVENT,
  ETHER_WRAP_EVENT,
  ETHER_UNWRAP_EVENT,
  COMPUTE_OUTPUT_AMOUNT_EVENT,
  COMPUTE_INPUT_AMOUNT_EVENT
} from "./constant"

import BigNumber from 'bignumber.js';

describe("large amount of wrapping/unwrapping/swapping agent", () => {
  let handleTransaction: HandleTransaction;
  const DECIMALS = 18;

  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if there are no large amount of wrapping/unwrapping/swapping ", async () => {
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC20_WRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC20_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC1155_WRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC1155_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ETHER_WRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ETHER_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        COMPUTE_OUTPUT_AMOUNT_EVENT,
        OCEAN_ADDRESS
      );
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        COMPUTE_INPUT_AMOUNT_EVENT,
        OCEAN_ADDRESS
      );
    });

    it("returns a finding if there is a large amount of tokens are wrapped", async () => {
      const mockerc20WrappingEvent = {
        args: {
          erc20Token: "0xdai",
          transferredAmount: ethers.BigNumber.from("6000000000000000000000"),
          wrappedAmount: ethers.BigNumber.from("6000000000000000000000"), //20k with 6 decimals,
          dust: ethers.BigNumber.from("0"),
          user: "0xabc",
          oceanId: 3456
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockerc20WrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);

      const normalizedValue = new BigNumber(mockerc20WrappingEvent.args.wrappedAmount.toString()).dividedBy(new BigNumber(10 ** 18));
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large ERC20 Amount Wrapped",
          description: `Large amount of erc20 token wrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc20Token : mockerc20WrappingEvent.args.erc20Token,
            user: mockerc20WrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC20_WRAP_EVENT,
        OCEAN_ADDRESS
      );
    });
  });
});
