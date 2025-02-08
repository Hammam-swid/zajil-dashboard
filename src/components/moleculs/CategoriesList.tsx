"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { ProductCategory } from "@/types";

interface CategoriesListProps {
  categories: ProductCategory[];
  level?: number;
}

export function CategoriesList({ categories, level = 0 }: CategoriesListProps) {
  return (
    <ul
      className={`w-full space-y-2 ${
        level > 0 ? "ms-4 mt-2 w-[calc(100%-1rem)]" : ""
      }`}
    >
      {categories?.map((category) => (
        <CategoryItem key={category.id} category={category} level={level} />
      ))}
    </ul>
  );
}

function CategoryItem({
  category,
  level,
}: {
  category: ProductCategory;
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <li dir="rtl">
      <div
        style={{
          backgroundColor: `#${category.background_color}`,
          color: `#${category.text_color}`,
        }}
        className={`
          flex flex-wrap items-center gap-2 space-x-3 rounded-md p-3 shadow-md transition-colors
          ${hasSubcategories ? "cursor-pointer hover:opacity-90" : ""}
        `}
        onClick={() => hasSubcategories && setIsOpen(!isOpen)}
      >
        {hasSubcategories && (
          <button
            className="focus:outline-none"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse category" : "Expand category"}
          >
            {isOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
        <img
          src={category.image || "/placeholder.svg"}
          alt={`${category.name} category`}
          width={60 - level * 10}
          height={60 - level * 10}
          className="rounded-md"
        />
        <div className="flex-grow">
          <p className="text-lg font-bold">{category.name}</p>
          <p className="text-body-sm brightness-50 grayscale-[0.5]">
            {category.description}
          </p>
        </div>
      </div>
      {hasSubcategories && isOpen && (
        <CategoriesList categories={category.children!} level={level + 1} />
      )}
    </li>
  );
}
