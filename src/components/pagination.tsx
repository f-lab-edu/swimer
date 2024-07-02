import React from 'react';
import { Pagination as PaginationLayout } from "@nextui-org/pagination";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
};

export default function Pagination({ totalItems, currentPage, onPageChange }: PaginationProps) {
    const ITEMS_PER_PAGE = 10;
    return (
      <div className="flex justify-center flex-wrap gap-4 items-center mt-5">
        <PaginationLayout total={Math.ceil(totalItems / ITEMS_PER_PAGE)} initialPage={currentPage} page={currentPage} onChange={onPageChange} color="primary" />
      </div>
    );
  }
