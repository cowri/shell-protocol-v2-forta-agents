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
  DECIMALS,
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

    it("returns a finding if there is a large amount of erc20 tokens are wrapped", async () => {
      const mockerc20WrappingEvent = {
        args: {
          erc20Token: "0xdai",
          transferredAmount: ethers.BigNumber.from("6000000000000000000000"),
          wrappedAmount: ethers.BigNumber.from("6000000000000000000000"),
          dust: ethers.BigNumber.from("0"),
          user: "0xabc",
          oceanId: 3456
        },
      };

      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockerc20WrappingEvent]);

      let findings = await handleTransaction(mockTxEvent);

      let normalizedValue = new BigNumber(mockerc20WrappingEvent.args.wrappedAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS));
  
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

    it("returns a finding if there is a large amount of erc20 tokens are unwrapped", async () => {
      const mockerc20UnWrappingEvent = {
        args: {
          erc20Token: "0xdai",
          transferredAmount: ethers.BigNumber.from("6000000000000000000000"),
          unwrappedAmount: ethers.BigNumber.from("6000000000000000000000"),
          feeCharged: ethers.BigNumber.from("10"),
          user: "0xabc",
          oceanId: 3456
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockerc20UnWrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);

      const normalizedValue = new BigNumber(mockerc20UnWrappingEvent.args.unwrappedAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS));
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large ERC20 Amount Unwrapped",
          description: `Large amount of erc20 token unwrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-2",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc20Token : mockerc20UnWrappingEvent.args.erc20Token,
            user: mockerc20UnWrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC20_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
    });

    it("returns a finding if there is a large amount of erc1155 tokens are wrapped", async () => {
      const mockerc1155WrappingEvent = {
        args: {
          erc1155Token: "0xnft",
          erc1155Id: 22334,
          amount: ethers.BigNumber.from("120"),
          user: "0xabc",
          oceanId: 3456
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockerc1155WrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large ERC1155 Amount Wrapped",
          description: `Large amount of erc1155 token wrapped: ${mockerc1155WrappingEvent.args.amount}`,
          alertId: "SHELL-V2-3",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc1155Token : mockerc1155WrappingEvent.args.erc1155Token,
            user: mockerc1155WrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC1155_WRAP_EVENT,
        OCEAN_ADDRESS
      ); 
    });

    it("returns a finding if there is a large amount of erc1155 tokens are unwrapped", async () => {
      const mockerc1155UnwrappingEvent = {
        args: {
          erc1155Token: "0xnft",
          erc1155Id: 22334,
          amount: ethers.BigNumber.from("120"),
          feeCharged: ethers.BigNumber.from("10"),
          user: "0xabc",
          oceanId: 3456
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockerc1155UnwrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large ERC1155 Amount Unwrapped",
          description: `Large amount of erc1155 token unwrapped: ${mockerc1155UnwrappingEvent.args.amount}`,
          alertId: "SHELL-V2-4",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc1155Token : mockerc1155UnwrappingEvent.args.erc1155Token,
            user: mockerc1155UnwrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC1155_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
    });

    it("returns a finding if there is a large amount of ether being wrapped", async () => {
      const mocketherWrappingEvent = {
        args: {
          amount: ethers.BigNumber.from("27000000000000000000"),
          user: "0xabc",
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mocketherWrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);

      const normalizedValue = new BigNumber(mocketherWrappingEvent.args.amount.toString()).dividedBy(new BigNumber(10 ** DECIMALS));
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large Ether Amount Wrapping",
          description: `Large amount of ether wrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-5",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            user: mocketherWrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ETHER_WRAP_EVENT,
        OCEAN_ADDRESS
      );
    });

    it("returns a finding if there is a large amount of tokens are unwrapped", async () => {
      const mocketherWrappingEvent = {
        args: {
          amount: ethers.BigNumber.from("27000000000000000000"),
          feeCharged: ethers.BigNumber.from("10"),
          user: "0xabc",
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mocketherWrappingEvent]);

      const findings = await handleTransaction(mockTxEvent);

      const normalizedValue = new BigNumber(mocketherWrappingEvent.args.amount.toString()).dividedBy(new BigNumber(10 ** DECIMALS));
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large Ether Amount UnWrapping",
          description: `Large amount of ether unwrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-6",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            user: mocketherWrappingEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ETHER_UNWRAP_EVENT,
        OCEAN_ADDRESS
      );
    });

    it("returns a finding if there is a large amount of tokens are swapped by passing input amount", async () => {

      const mockercomputeOutputAmountEvent = {
        args: {
          primitive: "0xprimitive",
          inputToken: 345,
          outputToken: 466,
          inputAmount: ethers.BigNumber.from("6000000000000000000000"),
          outputAmount: ethers.BigNumber.from("4000000000000000000000"),
          user: "0xabc",
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockercomputeOutputAmountEvent]);

      const findings = await handleTransaction(mockTxEvent);

      const normalizedValue = new BigNumber(mockercomputeOutputAmountEvent.args.inputAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS));
  
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Large Amount of input token swapped",
          description: `Large Amount of input token swapped: ${normalizedValue}`,
          alertId: "SHELL-V2-7",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            primitive : mockercomputeOutputAmountEvent.args.primitive,
            user: mockercomputeOutputAmountEvent.args.user,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(8);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        COMPUTE_OUTPUT_AMOUNT_EVENT,
        OCEAN_ADDRESS
      );
    });
  });
});
