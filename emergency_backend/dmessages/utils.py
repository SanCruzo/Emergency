import base64
import os
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from django.conf import settings

def derive_key(password, salt, iterations=100_000):
    return PBKDF2(password, salt, dkLen=32, count=iterations)

def encrypt_message(plain_text, password, salt):
    key = derive_key(password, salt)
    cipher = AES.new(key, AES.MODE_GCM)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(plain_text.encode())
    return base64.b64encode(nonce + tag + ciphertext).decode()

def decrypt_message(enc_text, password, salt):
    enc = base64.b64decode(enc_text)
    nonce = enc[:16]
    tag = enc[16:32]
    ciphertext = enc[32:]
    key = derive_key(password, salt)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag).decode() 