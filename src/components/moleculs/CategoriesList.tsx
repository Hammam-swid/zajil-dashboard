"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, Plus } from "lucide-react";
import { ProductCategory } from "@/types";
import { Button } from "../atomics";
import Modal from "./Modal";
import CategoryForm from "../templates/CategoryForm";

interface CategoriesListProps {
  categories: ProductCategory[];
  level?: number;
}

export function CategoriesList({ categories, level = 0 }: CategoriesListProps) {
  return (
    <ul
      className={`w-full space-y-2 ${
        level > 0 ? "ms-4 mt-1 w-[calc(100%-1rem)]" : ""
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
  const [modal, setModal] = useState(false);
  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <li dir="rtl">
      <div
        style={{
          backgroundColor: `#${category.background_color}10`,
        }}
        className={`
          flex flex-wrap items-center gap-2 space-x-3 rounded-md p-3 shadow-md transition-colors
          ${hasSubcategories ? "cursor-pointer hover:opacity-90" : ""}
        `}
        onClick={(
          e: React.MouseEvent<HTMLDivElement> & { target: HTMLDivElement }
        ) => {
          console.log(e.target.id);
          hasSubcategories &&
            !e.target.id.includes("add-subcategory-button") &&
            setIsOpen(!isOpen);
        }}
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
        <Image
          src={category.image || "/placeholder.svg"}
          alt={`${category.name} category`}
          width={60 - level * 10}
          height={60 - level * 10}
          className="rounded-md"
        />
        <div className="flex-grow">
          <span
            className="inline-block rounded-md px-2 py-1 text-lg font-bold"
            style={{
              backgroundColor: `#${category.background_color}`,
              color: `#${category.text_color}`,
            }}
          >
            {category.name}
          </span>
          <p className="mt-1 text-body-sm text-gray-500">
            {category.description}
          </p>
        </div>
        <Button
          id={`add-subcategory-button-${category.id}`}
          onClick={() => setModal(true)}
          size="sm"
          variant="default-outline"
        >
          <Plus
            id={`add-subcategory-button-${category.id}-icon`}
            className="h-4 w-4"
          />
        </Button>
      </div>
      {hasSubcategories && isOpen && (
        <CategoriesList categories={category.children!} level={level + 1} />
      )}
      <Modal
        variant="default"
        className="w-11/12 max-w-lg"
        open={modal}
        setOpen={setModal}
        title="إضافة صنف"
      >
        <CategoryForm parent={category} hideForm={() => setModal(false)} />
      </Modal>
    </li>
  );
}
