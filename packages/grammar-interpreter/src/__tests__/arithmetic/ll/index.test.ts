import should from "should";
import { Expr } from "./ast";
import { getLexer } from "../lexer";
import { genParser } from "../../../interp";
import { assert } from "@light0x00/shim";
import { TokenPro } from "@parser-generator/definition";
import fs from "fs";
import { LLParser } from "@parser-generator/core";

describe(`LL Arithmetic Parser Test`, () => {
	let parser : LLParser, digit : TokenPro;

	it(`fuck`, async () => {
		let { code } = genParser(`
		<% import { Expr,Term, Factor } from "./ast"; %>
		#TOKEN_PROTOTYPES
		digit

		#GRAMMAR
		E->F T <% (e)=>new Expr(e)  %>;
		T-> "+"F T| '-'F T | NIL <% (e)=>new Term(e) %>;
		F->digit | '('E')' <% (e)=>new Factor(e)%>;
		`, { parser: "LL", lang: "TS" });

		fs.writeFileSync(__dirname + "/parser.tmp.ts", code, { encoding: "utf-8", flag: "w+" });
		let exp = await import("./parser.tmp"!);
		parser = exp.parser;
		digit = exp.digit;

		assert(parser instanceof LLParser);
		assert(digit instanceof TokenPro);
	});

	it(`1+2-3+(4-5)`, function () {
		let ast = parser.parse(getLexer("1+2-3+(4-5)", digit));
		let r = (ast as Expr).eval();
		should(r).eql(-1);
	});

	it(`(1+2-3-4+5)+(6)-(7-8)`, function () {
		let ast = parser.parse(getLexer("(1+2-3-4+5)+(6)-(7-8)", digit));
		let r = (ast as Expr).eval();
		should(r).eql(8);
	});
});
