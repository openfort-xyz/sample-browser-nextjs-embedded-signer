import { AuthPlayerResponse, Provider, ShieldAuthentication, TokenType, TypedDataDomain, TypedDataField, ShieldAuthType } from '@openfort/openfort-js';
import openfort from '../utils/openfortConfig';
import { ThirdPartyOAuthProvider } from '@openfort/openfort-js';

const chainId = 80002;

class OpenfortService {
    async authenticateWithThirdPartyProvider(identityToken: string): Promise<AuthPlayerResponse> {
      try {
        return await openfort.authenticateWithThirdPartyProvider({provider:ThirdPartyOAuthProvider.FIREBASE, token:identityToken, tokenType:TokenType.ID_TOKEN});
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }
    getEvmProvider(): Provider {
      try {
        return openfort.getEthereumProvider({policy:"pol_e7491b89-528e-40bb-b3c2-9d40afa4fefc", announceProvider:true});

      } catch (error) {
        console.error('Error on getEthereumProvider:', error);
        throw error;
      }
    }
    async mintNFT(identityToken: string): Promise<string | null> {
      try {
        const collectResponse = await fetch(`/api/protected-collect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${identityToken}`,
          },
        });
  
        if (!collectResponse.ok) {
          alert("Failed to mint NFT status: " + collectResponse.status);
          return null
        }
        const collectResponseJSON = await collectResponse.json();
  
        if (collectResponseJSON.data?.nextAction) {
          const response = await openfort.sendSignatureTransactionIntentRequest(
            collectResponseJSON.data.id,
            collectResponseJSON.data.nextAction.payload.userOperationHash
          );
          return response.response?.transactionHash ?? null
        }else return null
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async signMessage(message: string): Promise<string | null> {
      try {
        console.log("Signing message", openfort)
        return await openfort.signMessage(message);
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string | null> {
      try {
        return await openfort.signTypedData(domain, types, value);
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async getEmbeddedState() {
      try {
        const state = await openfort.getEmbeddedState();
        return state;
      } catch (error) {
        console.error('Error retrieving embedded state from Openfort:', error);
        throw error;
      }
    }
     
    async setAutomaticRecoveryMethod(identityToken: string) {
      try {
        const shieldAuth: ShieldAuthentication = {
          auth: ShieldAuthType.OPENFORT,
          token: identityToken,
          authProvider: "firebase",
          tokenType: "idToken",
        };
        await openfort.configureEmbeddedSigner(chainId, shieldAuth);
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }

    async setPasswordRecoveryMethod(identityToken: string, pin: string) {
      try {
        const shieldAuth: ShieldAuthentication = {
          auth: ShieldAuthType.OPENFORT,
          token: identityToken,
          authProvider: "firebase",
          tokenType: "idToken",
        };
        await openfort.configureEmbeddedSigner(chainId, shieldAuth, pin);
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }
    async logout() {
      try {
        await openfort.logout();
      } catch (error) {
        console.error('Error logging out with Openfort:', error);
        throw error;
      }
    }
  }

  
  
  // Create a singleton instance of the OpenfortService
  const openfortService = new OpenfortService();
  
  export default openfortService;
  