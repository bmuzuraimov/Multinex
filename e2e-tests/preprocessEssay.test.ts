import { describe, expect, test } from "bun:test";
import { preprocessEssay } from "../app/src/server/utils/exerciseUtils";

describe("Essay Preprocessing", () => {
  // Test basic functionality for each section type
  test("should process type sections correctly", () => {
    const input = "<type>Hello</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello");
    expect(result.formattedEssay).toHaveLength(1);
    expect(result.formattedEssay[0].mode).toBe("type");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o"]);
  });

  test("should process listen sections correctly", () => {
    const input = "<listen>Hello World</listen>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello World");
    expect(result.formattedEssay).toHaveLength(1);
    expect(result.formattedEssay[0].mode).toBe("listen");
    expect(result.formattedEssay[0].text).toEqual(["Hello", " ", "World"]);
  });

  test("should process write sections correctly", () => {
    const input = "<write>Hello World</write>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello World");
    expect(result.formattedEssay).toHaveLength(1);
    expect(result.formattedEssay[0].mode).toBe("write");
    expect(result.formattedEssay[0].text).toEqual(["Hello World"]);
  });

  // Test multiple sections
  test("should process multiple sections correctly", () => {
    const input = "<type>Hello</type><listen>World</listen><write>!</write>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("HelloWorld!");
    expect(result.formattedEssay).toHaveLength(3);
    expect(result.formattedEssay[0].mode).toBe("type");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o"]);
    expect(result.formattedEssay[1].mode).toBe("listen");
    expect(result.formattedEssay[1].text).toEqual(["World"]);
    expect(result.formattedEssay[2].mode).toBe("write");
    expect(result.formattedEssay[2].text).toEqual(["!"]);
  });

  // Test intertag single whitespace
  test("should handle whitespace correctly", () => {
    const input = "<type>Hello World</type> <listen>!</listen> <write>!</write>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello World ! !");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", " "]);
    expect(result.formattedEssay[1].text).toEqual(["!", " "]);
    expect(result.formattedEssay[2].text).toEqual(["!"]);
  });

  // Test intertag single new line
  test("should handle newlines correctly", () => {
    const input = "<type>Hello World</type>\n<listen>!</listen>\n<write>!</write>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello World\n!\n!");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", "\n"]);
    expect(result.formattedEssay[1].text).toEqual(["!", "\n"]);
    expect(result.formattedEssay[2].text).toEqual(["!"]);
  });

  // Test newline handling
  test("should handle newlines correctly", () => {
    const input = "<type>Hello\nWorld</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello\nWorld");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", "\n", "W", "o", "r", "l", "d"]);
  });

  // Test empty sections
  test("should handle empty sections", () => {
    const input = "<type></type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("");
    expect(result.formattedEssay[0].text).toEqual([]);
  });

  // Test invalid input
  test("should handle invalid input gracefully", () => {
    const input = "Invalid input without tags";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("");
    expect(result.formattedEssay).toHaveLength(0);
  });

  // Test mixed content
  test("should handle mixed content with spaces and newlines", () => {
    const input = "<type>Hello</type> <listen>World</listen>\n<write>!</write>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello World\n!");
    expect(result.formattedEssay).toHaveLength(3);
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", " "]);
    expect(result.formattedEssay[1].text).toEqual(["World", "\n"]);
    expect(result.formattedEssay[2].text).toEqual(["!"]);
  });

  // Additional edge cases
  test("should handle nested tags correctly", () => {
    const input = "<type><type>Hello</type></type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("<type>Hello</type>");
    expect(result.formattedEssay).toHaveLength(1);
    expect(result.formattedEssay[0].text).toEqual(["<", "t", "y", "p", "e", ">", "H", "e", "l", "l", "o", "<", "/", "t", "y", "p", "e", ">"]);
  });

  test("should handle special characters", () => {
    const input = "<type>Hello!@#$%^&*()</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello!@#$%^&*()");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"]);
  });

  test("should handle unicode characters", () => {
    const input = "<type>Hello 世界</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello 世界");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", " ", "世", "界"]);
  });

  test("should handle multiple consecutive newlines", () => {
    const input = "<type>Hello\n\nWorld</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello\n\nWorld");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", "\n", "\n", "W", "o", "r", "l", "d"]);
  });

  test("should handle mixed whitespace and newlines", () => {
    const input = "<type>Hello  \n  World</type>";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("Hello  \n  World");
    expect(result.formattedEssay[0].text).toEqual(["H", "e", "l", "l", "o", " ", " ", "\n", " ", " ", "W", "o", "r", "l", "d"]);
  });

  test("should handle multiple outer newlines", () => {
    const input = "<type>type text</type>\n\n<listen>listen text</listen>\n\n<write>write text</write>\n\n";
    const result = preprocessEssay(input);
    
    expect(result.essay).toBe("type text\n\nlisten text\n\nwrite text\n\n");
    expect(result.formattedEssay[0].text).toEqual(["t", "y", "p", "e", " ", "t", "e", "x", "t", "\n", "\n"]);
    expect(result.formattedEssay[1].text).toEqual(["listen", " ", "text", "\n\n"]);
    expect(result.formattedEssay[2].text).toEqual(["write text", "\n\n"]);
  });
}); 