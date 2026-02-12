package cz.hostingcentrum.config;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Random;

@Service
public class EncryptedKeyService {
    private static final String ALGORITHM = "AES";
    private static final byte[] STATIC_KEY = "gH3kLmZ9sQwXvB7rYpCdJ2tN6F0A5T8U".getBytes();
    private static final SecretKey secretKey = new SecretKeySpec(STATIC_KEY, ALGORITHM);

    public String encrypt(String strToEncrypt) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encrypted = cipher.doFinal(strToEncrypt.getBytes());
            return Base64.getUrlEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            System.out.println("Error while encrypting: " + e.toString());
        }
        return null;
    }

    public String decrypt(String strToDecrypt) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decrypted = cipher.doFinal(Base64.getUrlDecoder().decode(strToDecrypt));
            return new String(decrypted);
        } catch (Exception e) {
            System.out.println("Error while decrypting: " + e.toString());
        }
        return null;
    }

    public int generateActivationCode() {
        Random random = new Random();
        return 100000 + random.nextInt(899999);
    }
}
