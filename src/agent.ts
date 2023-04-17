import {
	Finding,
	HandleTransaction,
	TransactionEvent,
	FindingSeverity,
	FindingType
} from "forta-agent";

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
	COMPUTE_INPUT_AMOUNT_EVENT,
	ETHER_OCEAN_ID
} from "./constant";

import BigNumber from "bignumber.js";


const handleTransaction: HandleTransaction = async (
	txEvent: TransactionEvent
) => {
	const findings: Finding[] = [];

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
		const { erc20Token, wrappedAmount, user } = erc20WrapEvent.args;

		const normalizedValue = wrappedAmount ? new BigNumber(wrappedAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);

		if (normalizedValue.gt(1000)) {
			findings.push(
				Finding.fromObject({
					name: "Large ERC20 Amount Wrapped",
					description: `Large amount of erc20 token wrapped: ${normalizedValue}`,
					alertId: "SHELL-V2-1",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						erc20Token,
						user,
					},
				})
			);
		}
	});

	erc20UnWrapEvents.forEach((erc20UnWrapEvent) => {
		// extract unwrap erc20 event arguments
		const { erc20Token, unwrappedAmount, user } = erc20UnWrapEvent.args;

		const normalizedValue = unwrappedAmount ? new BigNumber(unwrappedAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);

		if (normalizedValue.gt(1000)) {
			findings.push(
				Finding.fromObject({
					name: "Large ERC20 Amount Unwrapped",
					description: `Large amount of erc20 token unwrapped: ${normalizedValue}`,
					alertId: "SHELL-V2-2",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						erc20Token,
						user,
					},
				})
			);
		}
	});

	erc1155WrapEvents.forEach((erc1155WrapEvent) => {
		// extract wrap erc1155 event arguments
		let { erc1155Token, amount, user } = erc1155WrapEvent.args;

		amount = amount && !erc1155WrapEvent.args.feeCharged && erc1155Token ? amount : new BigNumber(0);

		if (amount.gt(100)) {
			findings.push(
				Finding.fromObject({
					name: "Large ERC1155 Amount Wrapped",
					description: `Large amount of erc1155 token wrapped: ${amount}`,
					alertId: "SHELL-V2-3",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						erc1155Token,
						user,
					},
				})
			);
		}
	});

	erc1155UnWrapEvents.forEach((erc1155UnWrapEvent) => {
		// extract wrap erc1155 event arguments
		let { erc1155Token, amount, feeCharged, user } = erc1155UnWrapEvent.args;

		amount = amount && feeCharged && erc1155Token ? amount : new BigNumber(0);

		if (amount.gt(100)) {
			findings.push(
				Finding.fromObject({
					name: "Large ERC1155 Amount Unwrapped",
					description: `Large amount of erc1155 token unwrapped: ${amount}`,
					alertId: "SHELL-V2-4",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						erc1155Token,
						user,
					},
				})
			);
		}
	});

	etherWrapEvents.forEach((etherWrapEvent) => {
		// extract ether wrap event arguments
		const { amount, user } = etherWrapEvent.args;

		const normalizedValue = amount && !etherWrapEvent.args.feeCharged ? new BigNumber(amount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);

		if (normalizedValue.gt(25)) {
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
		}
	});


	etherUnWrapEvents.forEach((etherUnWrapEvent) => {
		// extract ether unwrap event arguments
		const { amount, feeCharged, user } = etherUnWrapEvent.args;

		const normalizedValue = amount && feeCharged ? new BigNumber(amount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);

		if (normalizedValue.gt(25)) {
			findings.push(
				Finding.fromObject({
					name: "Large Ether Amount UnWrapping",
					description: `Large amount of ether unwrapped: ${normalizedValue}`,
					alertId: "SHELL-V2-6",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						user,
					},
				})
			);
		}
	});

	computeOutputAmountEvents.forEach((computeOutputAmountEvent) => {
		// extract compute output event arguments
		const { primitive, inputAmount, inputToken, user } = computeOutputAmountEvent.args;

		const normalizedValue = inputAmount ? new BigNumber(inputAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);
  
		if ((inputToken == ETHER_OCEAN_ID && normalizedValue.gt(15)) || normalizedValue.gt(1000)) {
			findings.push(
				Finding.fromObject({
					name: "Large Amount of input token swapped",
					description: `Large Amount of input token swapped: ${normalizedValue}`,
					alertId: "SHELL-V2-7",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						primitive,
						user,
					},
				})
			);
		}
	});


	computeInputAmountEvents.forEach((computeInputAmountEvent) => {
		// extract compute output event arguments
		const { primitive, inputAmount, inputToken, user } = computeInputAmountEvent.args;

		const normalizedValue = inputAmount ? new BigNumber(inputAmount.toString()).dividedBy(new BigNumber(10 ** DECIMALS)) : new BigNumber(0);

		if ((inputToken == ETHER_OCEAN_ID && normalizedValue.gt(15)) || normalizedValue.gt(1000)) {
			findings.push(
				Finding.fromObject({
					name: "Large Amount of input token swapped",
					description: `Large Amount of input token swapped: ${normalizedValue}`,
					alertId: "SHELL-V2-8",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						primitive,
						user,
					},
				})
			);
		}
	});
	return findings;
};

export default {
	handleTransaction
};
