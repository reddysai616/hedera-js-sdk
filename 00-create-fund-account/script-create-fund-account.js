import {
    Client,
    AccountId,
    PrivateKey,
    AccountBalanceQuery,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

async function main() {
    // Ensure required environment variables are available
    dotenv.config();
    if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
        throw new Error('Please set required keys in .env file.');
    }

    // Configure client using environment variables
    const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
    const accountKey = PrivateKey.fromStringECDSA(process.env.ACCOUNT_PRIVATE_KEY);

    // Initialize client
    const client = Client.forTestnet().setOperator(accountId, accountKey);

    // Query tHBAR balance using AccountBalanceQuery
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);

    // Check if hbars property is present before accessing it
    if (accountBalance.hbars) {
        // Convert balance result object to Hbars
        const accountBalanceHbars = accountBalance.hbars.toBigNumber();

        // Format balance string
        const accountBalanceString = new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
        }).format(accountBalanceHbars);

        // Output results
        const accountExplorerUrl = `https://hashscan.io/testnet/account/${accountId}`;
        console.log(`accountId: ${accountId}`);
        console.log(`accountBalanceTinybars: ${accountBalanceString}`);
        console.log(`accountExplorerUrl: ${accountExplorerUrl}`);
    } else {
        console.error('Error: hbars property not found in accountBalance');
    }

    setTimeout(() => { process.exit(0); }, 100);
}

main();

export default main;
