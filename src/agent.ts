import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  Initialize
} from "forta-agent";

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


let findingsCount = 0;

const initialize: Initialize = async () => {
  // do some initialization on startup e.g. fetch data
}

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  const DECIMALS = 18;

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  const erc20WrapEvents = txEvent.filterLog(
    ERC20_WRAP_EVENT,
    OCEAN_ADDRESS
  );

  const erc20UnWrapEvents = txEvent.filterLog(
    ERC20_UNWRAP_EVENT,
    OCEAN_ADDRESS
  );

  const erc1155WrapEvents = txEvent.filterLog(
    ERC1155_WRAP_EVENT,
    OCEAN_ADDRESS
  );

  const erc1155UnWrapEvents = txEvent.filterLog(
    ERC1155_UNWRAP_EVENT,
    OCEAN_ADDRESS
  );

  const etherWrapEvents = txEvent.filterLog(
    ETHER_WRAP_EVENT,
    OCEAN_ADDRESS
  );

  const etherUnWrapEvents = txEvent.filterLog(
    ETHER_UNWRAP_EVENT,
    OCEAN_ADDRESS
  );

  const computeOutputAmountEvents = txEvent.filterLog(
    COMPUTE_OUTPUT_AMOUNT_EVENT,
    OCEAN_ADDRESS
  );

  const computeInputAmountEvents = txEvent.filterLog(
    COMPUTE_INPUT_AMOUNT_EVENT,
    OCEAN_ADDRESS
  );

  erc20WrapEvents.forEach((erc20WrapEvent) => {
    // extract wrap erc20 event arguments
    const { erc20Token, transferredAmount, wrappedAmount, dust, user, oceanId } = erc20WrapEvent.args;

    const normalizedValue = wrappedAmount.div(10 ** DECIMALS);

    if (normalizedValue.gt(10000)) {
      findings.push(
        Finding.fromObject({
          name: "Large ERC20 Amount Wrapped",
          description: `Large amount of erc20 token wrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc20Token,
            transferredAmount,
            dust,
            user,
            oceanId
          },
        })
      );
      findingsCount++;
    }
  });

erc20UnWrapEvents.forEach((erc20UnWrapEvent) => {
    // extract unwrap erc20 event arguments
    const { erc20Token, transferredAmount, wrappedAmount, feeCharged, user, oceanId } = erc20UnWrapEvent.args;

    const normalizedValue = wrappedAmount.div(10 ** DECIMALS);

    if (normalizedValue.gt(10000)) {
      findings.push(
        Finding.fromObject({
          name: "Large ERC20 Amount UnWrapped",
          description: `Large amount of erc20 token unwrapped: ${normalizedValue}`,
          alertId: "SHELL-V2-2",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc20Token,
            transferredAmount,
            feeCharged,
            user,
            oceanId
          },
        })
      );
      findingsCount++;
    }
});


erc1155WrapEvents.forEach((erc1155WrapEvent) => {
    // extract wrap erc1155 event arguments
    const { erc1155Token, erc1155Id, amount, user, oceanId } = erc1155WrapEvent.args;

    if (amount.gt(1000)) {
      findings.push(
        Finding.fromObject({
          name: "Large ERC1155 Amount Wrapped",
          description: `Large amount of erc1155 token wrapped: ${amount}`,
          alertId: "SHELL-V2-3",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc1155Token,
            erc1155Id,
            user,
            oceanId
          },
        })
      );
      findingsCount++;
    }
});


erc1155UnWrapEvents.forEach((erc1155UnWrapEvent) => {
    // extract wrap erc1155 event arguments
    const { erc1155Token, erc1155Id, amount, feeCharged, user, oceanId } = erc1155UnWrapEvent.args;

    if (amount.gt(1000)) {
      findings.push(
        Finding.fromObject({
          name: "Large ERC1155 Amount UnWrapped",
          description: `Large amount of erc1155 token unwrapped: ${amount}`,
          alertId: "SHELL-V2-4",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            erc1155Token,
            erc1155Id,
            feeCharged,
            user,
            oceanId
          },
        })
      );
      findingsCount++;
    }
});

etherWrapEvents.forEach((etherWrapEvent) => {
  // extract ether wrap event arguments
  const { amount, user } = etherWrapEvent.args;

  const normalizedValue = amount.div(10 ** DECIMALS);

  // if more than 10,000 Tether were transferred, report it
  if (normalizedValue.gt(10000)) {
    findings.push(
      Finding.fromObject({
        name: "Large Ether Amount Wrapping",
        description: `Large amount of ether wrapped: ${normalizedValue}`,
        alertId: "SHELL-V2-5",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          user,
        },
      })
    );
    findingsCount++;
  }
});


etherUnWrapEvents.forEach((etherUnWrapEvent) => {
  // extract ether unwrap event arguments
  const { amount, feeCharged, user } = etherUnWrapEvent.args;

  const normalizedValue = amount.div(10 ** DECIMALS);

  // if more than 10,000 Tether were transferred, report it
  if (normalizedValue.gt(10000)) {
    findings.push(
      Finding.fromObject({
        name: "Large Ether Amount UnWrapping",
        description: `Large amount of ether unwrapped: ${normalizedValue}`,
        alertId: "SHELL-V2-6",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          feeCharged,
          user,
        },
      })
    );
    findingsCount++;
  }
});

computeOutputAmountEvents.forEach((computeOutputAmountEvent) => {
  // extract compute output event arguments
  const { primitive, inputToken, outputToken, inputAmount, outputAmount, user } = computeOutputAmountEvent.args;
  // shift decimals of transfer value
  const normalizedValue = inputAmount.div(10 ** DECIMALS);

  // if more than 10,000 Tether were transferred, report it
  if (normalizedValue.gt(10000)) {
    findings.push(
      Finding.fromObject({
        name: "Large Amount of input token swapped",
        description: `Large Amount of input token swapped: ${normalizedValue}`,
        alertId: "SHELL-V2-7",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          primitive,
          inputToken,
          outputToken,
          outputAmount,
          user,
        },
      })
    );
    findingsCount++;
  }
});


computeInputAmountEvents.forEach((computeInputAmountEvent) => {
  // extract compute output event arguments
  const { primitive, inputToken, outputToken, inputAmount, outputAmount, user } = computeInputAmountEvent.args;
  // shift decimals of transfer value
  const normalizedValue = inputAmount.div(10 ** DECIMALS);

  // if more than 10,000 Tether were transferred, report it
  if (normalizedValue.gt(10000)) {
    findings.push(
      Finding.fromObject({
        name: "Large Amount of input token swapped",
        description: `Large Amount of input token swapped: ${normalizedValue}`,
        alertId: "SHELL-V2-8",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          primitive,
          inputToken,
          outputToken,
          outputAmount,
          user,
        },
      })
    );
    findingsCount++;
  }
});
return findings;
};


export default {
  initialize,
  handleTransaction
};
