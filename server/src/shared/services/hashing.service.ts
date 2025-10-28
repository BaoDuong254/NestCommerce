import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";

const salt = 10;

@Injectable()
export class HashingService {
  hash(value: string) {
    return hash(value, salt);
  }

  compare(value: string, hashedValue: string) {
    return compare(value, hashedValue);
  }
}
