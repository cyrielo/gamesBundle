import { Tile } from "./Tile";

export class User {
  name: string;
  score: number;
  isAI: boolean;
  rack: Tile[] = [];

  constructor(name: string, isAI: boolean = false) {
    this.name = name;
    this.score = 0;
    this.isAI = isAI;
  }
}
