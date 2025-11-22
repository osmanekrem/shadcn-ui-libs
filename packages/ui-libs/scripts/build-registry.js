#!/usr/bin/env node

/**
 * Build script for generating shadcn registry JSON files
 * This script reads source files and generates registry JSON files automatically
 */

const fs = require("fs");
const path = require("path");

const REGISTRY_CONFIG_PATH = path.join(__dirname, "../registry.config.json");
const REGISTRY_DIR = path.join(__dirname, "../registry");
const SRC_DIR = path.join(__dirname, "../src");

// Read registry config
const config = JSON.parse(fs.readFileSync(REGISTRY_CONFIG_PATH, "utf-8"));

/**
 * Escape content for JSON
 */
function escapeForJson(content) {
  return content
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Transform import paths to use aliases
 */
function transformImports(content, filePath) {
  // Calculate relative depth from src/ to determine import paths
  const srcRelativePath = filePath.replace(/^src\//, "");
  const depth = (srcRelativePath.match(/\//g) || []).length;

  // Transform lib imports (../../lib/xxx -> @/lib/xxx)
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/lib\/([^'"]+)['"]/g,
    "from '@/lib/$1'"
  );

  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/lib\/([^'"]+)['"]/g,
    "from '@/lib/$1'"
  );

  // Transform types imports
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/([^'"]+)['"]/g,
    "from '@/types/$1'"
  );

  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/types\/([^'"]+)['"]/g,
    "from '@/types/$1'"
  );

  // Transform ui component imports
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/ui\/([^'"]+)['"]/g,
    "from '@/components/ui/$1'"
  );

  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/ui\/([^'"]+)['"]/g,
    "from '@/components/ui/$1'"
  );

  // Transform custom component imports (same directory or parent)
  // Handle ../filter-input, ../debounced-input, etc.
  if (filePath.includes("custom/")) {
    // For files in custom/ directory
    content = content.replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, (match, p1) => {
      // Skip if it's already transformed or external
      if (p1.startsWith("@/") || p1.startsWith("@") || p1.startsWith(".")) {
        return match;
      }
      // Check if it's a custom component
      if (
        p1.includes("filter-input") ||
        p1.includes("debounced-input") ||
        p1.includes("column-visibility") ||
        p1.includes("pagination") ||
        p1.includes("draggable-header") ||
        p1.includes("column-resize-handle") ||
        p1.includes("multi-select")
      ) {
        return `from '@/components/custom/${p1}'`;
      }
      return match;
    });

    // Handle ./actions, ./index imports within same directory
    content = content.replace(/from\s+['"]\.\/([^'"]+)['"]/g, (match, p1) => {
      if (filePath.includes("datatable/")) {
        return `from '@/components/custom/datatable/${p1}'`;
      }
      return match;
    });
  }

  return content;
}

/**
 * Read and process a source file
 */
function readSourceFile(srcPath) {
  const fullPath = path.join(__dirname, "..", srcPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Warning: Source file not found: ${srcPath}`);
    return null;
  }

  let content = fs.readFileSync(fullPath, "utf-8");

  // Transform imports
  content = transformImports(content, srcPath);

  return content;
}

/**
 * Build registry JSON for a component
 */
function buildRegistryJson(componentName, componentConfig) {
  const files = [];

  for (const fileConfig of componentConfig.files) {
    const content = readSourceFile(fileConfig.src);

    if (content === null) {
      continue;
    }

    files.push({
      path: fileConfig.dest,
      target: fileConfig.dest,
      content: content,
      type: fileConfig.type,
    });
  }

  // Map old type format to new registry format
  const typeMap = {
    "components:custom": "registry:component",
    "components:ui": "registry:ui",
    "lib:utils": "registry:lib",
    types: "registry:file",
  };

  // Transform file types
  const transformedFiles = files.map((file) => ({
    ...file,
    type: typeMap[file.type] || "registry:file",
  }));

  return {
    $schema: "https://ui.shadcn.com/schema.json",
    name: componentConfig.name,
    type: typeMap[componentConfig.type] || "registry:component",
    description: componentConfig.description || "",
    registryDependencies: componentConfig.registryDependencies || [],
    dependencies: componentConfig.dependencies || [],
    files: transformedFiles,
    tailwind: {
      config: {
        theme: {
          extend: {},
        },
      },
    },
  };
}

/**
 * Main build function
 */
function buildRegistry() {
  console.log("🔨 Building registry files...\n");

  // Ensure registry directory exists
  if (!fs.existsSync(REGISTRY_DIR)) {
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
  }

  // Build each component
  for (const [componentName, componentConfig] of Object.entries(
    config.components
  )) {
    console.log(`📦 Building ${componentName}...`);

    const registryJson = buildRegistryJson(componentName, componentConfig);
    const outputPath = path.join(REGISTRY_DIR, `${componentName}.json`);

    // Write JSON file with proper formatting
    fs.writeFileSync(
      outputPath,
      JSON.stringify(registryJson, null, 2),
      "utf-8"
    );

    console.log(`✅ Generated ${outputPath}`);
    console.log(`   - ${registryJson.files.length} files included\n`);
  }

  console.log("✨ Registry build complete!");
}

// Run build
try {
  buildRegistry();
} catch (error) {
  console.error("❌ Error building registry:", error);
  process.exit(1);
}
