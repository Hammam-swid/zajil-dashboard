"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  GalleryHorizontalEnd,
  Plus,
} from "lucide-react";
import { ProductCategory } from "@/types";
import { Button } from "../atomics";
import Modal from "./Modal";
import CategoryForm from "../templates/CategoryForm";
import CategoryVariations from "../templates/CategoryVariations";

interface CategoriesListProps {
  categories: ProductCategory[];
  level?: number;
}

export function CategoriesList({ categories, level = 0 }: CategoriesListProps) {
  return (
    <ul
      dir="rtl"
      className={`${
        level > 0
          ? "me-2 mt-2 w-[95%] justify-self-end rounded-md border p-2"
          : ""
      } ${level % 2 !== 0 ? "bg-gray-50" : "bg-white"}`}
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
  const [edit, setEdit] = useState(false);
  const [varModal, setVarModal] = useState(false);
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
            !e.target.id.includes("category-variations") &&
            setIsOpen(!isOpen);
        }}
        onContextMenu={(
          e: React.MouseEvent<HTMLDivElement> & { target: HTMLDivElement }
        ) => {
          e.preventDefault();
          e.stopPropagation();
          setEdit(true);
          setModal(true);
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
          width={60}
          height={60}
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
        <div className="flex items-center gap-2">
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
          {level > 0 && !hasSubcategories && (
            <div title={"المتغيرات الخاصة بــ" + category.name}>
              <Button
                id={`category-variations-${category.id}`}
                size="sm"
                variant="default-outline"
                onClick={() => setVarModal(true)}
              >
                <GalleryHorizontalEnd
                  id={`category-variations-${category.id}-icon`}
                  className="h-4 w-4"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
      {hasSubcategories && isOpen && (
        <CategoriesList categories={category.children!} level={level + 1} />
      )}
      <Modal
        variant="default"
        className="w-11/12 max-w-lg"
        open={modal}
        setOpen={setModal}
        title={edit ? "تعديل فئة" : "إضافة فئة"}
      >
        <CategoryForm
          parent={edit ? category.parent || null : category}
          hideForm={() => setModal(false)}
          category={edit ? category : undefined}
        />
      </Modal>
      <Modal
        open={varModal}
        setOpen={setVarModal}
        variant="default"
        title="متغيرات الفئة"
        className="w-11/12 max-w-lg"
      >
        <CategoryVariations
          category={category}
          hideForm={() => setVarModal(false)}
        />
      </Modal>
    </li>
  );
}
