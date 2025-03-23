declare module "circomlibjs" {
  export function buildMimcSponge(): Promise<{
    multiHash: (inputs: bigint[]) => bigint;
    F: {
      toString: (val: bigint) => string;
    };
  }>;
}

declare module "crypto-js" {
  namespace CryptoJS {
    interface CipherParams {
      toString(encoder?: Encoder): string;
    }

    interface Encoder {
      stringify(wordArray: WordArray): string;
      parse(str: string): WordArray;
    }

    interface WordArray {
      words: number[];
      sigBytes: number;
    }

    namespace AES {
      function encrypt(message: string, key: string): CipherParams;
      function decrypt(ciphertext: string, key: string): CipherParams;
    }

    const enc: {
      Utf8: Encoder;
      Base64: Encoder;
      Hex: Encoder;
    };
  }

  export = CryptoJS;
}
