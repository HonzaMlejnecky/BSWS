package cz.hostingcentrum.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Random;

@Service
public class EncryptedKeyService {
    private static final Logger log = LoggerFactory.getLogger(EncryptedKeyService.class);
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
            log.error("Error while encrypting: {}", e.getMessage());
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
            log.error("Error while decrypting: {}", e.getMessage());
        }
        return null;
    }

    public int generateActivationCode() {
        Random random = new Random();
        return 100000 + random.nextInt(899999);
    }
}
