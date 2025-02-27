import React from "react";

import { ArrowLeft2Icon, ArrowRight2Icon } from "@/assets/icons";
interface PaginationProps {
  page: number;
  lastPage: number;
  isLoading?: boolean;
  setPage: (v: number) => void;
}

const Pagination = ({
  page,
  setPage,
  lastPage,
  isLoading,
}: PaginationProps) => {
  const paginations = [];
  for (let index = 0; index < lastPage; index++) {
    paginations.push({
      name: `${index + 1}`,
      isActive: index + 1 === page ? true : false,
    });
  }
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNext = () => {
    if (page < paginations.length) {
      setPage(page + 1);
    }
  };
  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="Pagination flex w-full items-center justify-between border-t border-netral-30 pt-4">
      <h5 className="text-body-sm font-medium text-netral-50">Page 1 of 2</h5>
      <div className="flex flex-row gap-3">
        <button
          onClick={handlePrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg-10 bg-transparent text-body-sm font-semibold leading-none text-netral-60 transition-all duration-300 ease-out hover:bg-netral-30"
        >
          <ArrowRight2Icon className="h-4 w-4 stroke-2" />
        </button>

        {paginations.map((pagination, index, array) =>
          index < 3 ||
          array.length === index + 1 ||
          page === index + 2 ||
          index + 2 === page + 1 ? (
            <button
              onClick={() => setPage(index + 1)}
              key={index}
              className={`flex h-8 w-8 items-center justify-center rounded-lg-10 ${
                page === index + 1
                  ? "cursor-auto bg-primary-main text-white"
                  : "cursor-pointer bg-white text-netral-60 hover:bg-netral-30"
              } text-body-sm font-semibold leading-none transition-all duration-300 ease-out`}
            >
              {pagination.name}
            </button>
          ) : (
            "."
          )
        )}

        <button
          onClick={handleNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg-10 bg-transparent text-body-sm font-semibold leading-none text-netral-60 transition-all duration-300 ease-out hover:bg-netral-30"
        >
          <ArrowLeft2Icon className="h-4 w-4 stroke-2" />
        </button>
      </div>
    </div>
  );
};

function Skeleton() {
  return (
    <div className="Pagination flex w-full items-center justify-between border-t border-netral-30 pt-4">
      <h5 className="text-body-sm font-medium text-netral-50">Page 1 of 2</h5>
      <div className="flex flex-row gap-3">
        <button
          disabled
          className="flex h-8 w-8 items-center justify-center rounded-lg-10 bg-transparent text-body-sm font-semibold leading-none text-netral-60 transition-all duration-300 ease-out hover:bg-netral-30"
        >
          <ArrowRight2Icon className="h-4 w-4 stroke-2" />
        </button>
        {[0, 1, 2].map((item, index) => (
          <button
            disabled
            key={index}
            className="flex h-8 w-8 animate-pulse items-center justify-center rounded-lg-10 bg-transparent text-body-sm font-semibold leading-none text-netral-60 transition-all duration-300 ease-out hover:bg-netral-30"
          >
            {item + 1}
          </button>
        ))}
        <button
          disabled
          className="flex h-8 w-8 items-center justify-center rounded-lg-10 bg-transparent text-body-sm font-semibold leading-none text-netral-60 transition-all duration-300 ease-out hover:bg-netral-30"
        >
          <ArrowLeft2Icon className="h-4 w-4 stroke-2" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
