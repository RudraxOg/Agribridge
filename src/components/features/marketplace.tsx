"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  GitCompareArrows,
  List,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { lots } from "@/lib/demo-data";
import { formatINR } from "@/lib/format/currency";
import { CropVisual } from "./crop-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form-controls";

type Filters = {
  certification: string;
  district: string;
  maxPricePaise: string;
  minQuantityKg: string;
};

const initialFilters: Filters = {
  certification: "all",
  district: "",
  maxPricePaise: "",
  minQuantityKg: "",
};

function toPaise(value: string) {
  const rupees = Number(value);
  return Number.isFinite(rupees) && rupees >= 0
    ? Math.round(rupees * 100)
    : undefined;
}

export function Marketplace({
  locale,
  basePath = "/buyer",
}: {
  locale: string;
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [savedLotIds, setSavedLotIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const maxPricePaise = toPaise(filters.maxPricePaise);
    const minQuantityKg = Number(filters.minQuantityKg);
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedDistrict = filters.district.trim().toLowerCase();

    return lots.filter((lot) => {
      const isSearchMatch =
        !normalizedQuery ||
        `${lot.name} ${lot.variety} ${lot.location} ${lot.fpo}`
          .toLowerCase()
          .includes(normalizedQuery);
      const isGradeMatch = grade === "all" || lot.grade === grade;
      const isDistrictMatch =
        !normalizedDistrict ||
        lot.location.toLowerCase().includes(normalizedDistrict);
      const isPriceMatch =
        maxPricePaise === undefined || lot.pricePaise <= maxPricePaise;
      const isQuantityMatch =
        !Number.isFinite(minQuantityKg) ||
        minQuantityKg <= 0 ||
        lot.quantityKg >= minQuantityKg;
      const isCertificationMatch =
        filters.certification === "all" ||
        lot.certifications.includes(filters.certification);
      return (
        isSearchMatch &&
        isGradeMatch &&
        isDistrictMatch &&
        isPriceMatch &&
        isQuantityMatch &&
        isCertificationMatch
      );
    });
  }, [filters, grade, query]);

  const hasAdvancedFilters =
    filters.certification !== "all" ||
    Boolean(filters.district || filters.maxPricePaise || filters.minQuantityKg);
  const toggleSavedLot = (lotId: string, lotName: string) => {
    setSavedLotIds((current) => {
      const isSaved = current.includes(lotId);
      toast.success(
        isSaved
          ? `${lotName} removed from saved lots`
          : `${lotName} saved for comparison`,
      );
      return isSaved
        ? current.filter((id) => id !== lotId)
        : [...current, lotId];
    });
  };

  return (
    <>
      <div className="mb-5 grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_180px_auto]">
        <label className="relative">
          <span className="sr-only">Search crop, FPO or district</span>
          <Search
            className="absolute top-3.5 left-3 text-[var(--text-muted)]"
            size={19}
            aria-hidden
          />
          <Input
            className="border-0 bg-[var(--surface-muted)] pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search crop, FPO or district"
          />
        </label>
        <Select
          aria-label="Grade filter"
          value={grade}
          onChange={(event) => setGrade(event.target.value)}
        >
          <option value="all">All grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "primary" : "secondary"}
            size="icon"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List aria-hidden />
          </Button>
          <Button
            variant={view === "map" ? "primary" : "secondary"}
            size="icon"
            aria-label="Map view"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
          >
            <Map aria-hidden />
          </Button>
          <Button
            variant={filtersOpen ? "primary" : "secondary"}
            size="icon"
            aria-label="More filters"
            aria-expanded={filtersOpen}
            aria-controls="marketplace-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal aria-hidden />
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <Card id="marketplace-filters" className="mb-5 p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-black">Refine lots</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Filters apply to the simulated marketplace catalog.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters(initialFilters)}
              disabled={!hasAdvancedFilters}
            >
              <X size={17} aria-hidden />
              Clear filters
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-1.5 text-sm font-bold">
              District or state
              <Input
                value={filters.district}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    district: event.target.value,
                  }))
                }
                placeholder="e.g. Uttar Pradesh"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              Minimum quantity (kg)
              <Input
                type="number"
                min="0"
                inputMode="numeric"
                value={filters.minQuantityKg}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    minQuantityKg: event.target.value,
                  }))
                }
                placeholder="e.g. 10000"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              Maximum price (₹/kg)
              <Input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={filters.maxPricePaise}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    maxPricePaise: event.target.value,
                  }))
                }
                placeholder="e.g. 30"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              Certification
              <Select
                value={filters.certification}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    certification: event.target.value,
                  }))
                }
              >
                <option value="all">Any certification</option>
                <option value="AGMARK">AGMARK</option>
                <option value="Lab verified">Lab verified</option>
                <option value="Residue tested">Residue tested</option>
                <option value="FPO declared">FPO declared</option>
                <option value="GI region">GI region</option>
              </Select>
            </label>
          </div>
        </Card>
      )}

      <p className="mb-4 text-sm text-[var(--text-muted)]" role="status">
        {filtered.length} simulated lot{filtered.length === 1 ? "" : "s"} shown
        {savedLotIds.length ? ` · ${savedLotIds.length} saved` : ""}
      </p>
      {view === "map" && (
        <Card className="field-lines relative mb-5 grid min-h-80 place-items-center overflow-hidden bg-[var(--forest)] text-white">
          <div className="absolute inset-8 rounded-[50%] border border-white/20" />
          <div className="absolute top-16 left-[25%] size-4 rounded-full bg-[var(--harvest)] ring-8 ring-white/10" />
          <div className="absolute right-[28%] bottom-20 size-4 rounded-full bg-[var(--harvest)] ring-8 ring-white/10" />
          <div className="relative text-center">
            <Map className="mx-auto mb-3" aria-hidden />
            <p className="font-black">Map preview · {filtered.length} lots</p>
            <p className="text-sm text-white/65">
              Interactive map tiles load on the shipment screen.
            </p>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="grid min-h-56 place-items-center p-6 text-center">
          <div>
            <h2 className="font-black">No lots match these filters</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Try removing a filter or broaden your search.
            </p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={() => {
                setQuery("");
                setGrade("all");
                setFilters(initialFilters);
              }}
            >
              Reset marketplace
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lot) => {
            const isSaved = savedLotIds.includes(lot.id);
            return (
              <Card
                key={lot.id}
                className="overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <Link href={`/${locale}${basePath}/products/${lot.id}`}>
                  <CropVisual code={lot.image} colour={lot.colour} compact />
                </Link>
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/${locale}${basePath}/products/${lot.id}`}
                        className="text-lg font-black hover:text-[var(--field)]"
                      >
                        {lot.name}
                      </Link>
                      <p className="text-sm text-[var(--text-muted)]">
                        {lot.variety} · {lot.location}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSavedLot(lot.id, lot.name)}
                      className={`grid size-11 place-items-center rounded-xl transition hover:bg-[var(--surface-muted)] ${isSaved ? "bg-[var(--surface-muted)] text-[var(--field)]" : ""}`}
                      aria-label={`${isSaved ? "Remove" : "Save"} ${lot.name}`}
                      aria-pressed={isSaved}
                    >
                      <Bookmark
                        size={19}
                        fill={isSaved ? "currentColor" : "none"}
                        aria-hidden
                      />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lot.certifications.map((certification) => (
                      <Badge key={certification}>{certification}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-[var(--border)] pt-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {lot.quantityKg / 1000} t available
                      </p>
                      <p className="tabular text-xl font-black">
                        {formatINR(lot.pricePaise, locale)}
                        <span className="text-sm font-medium">/kg</span>
                      </p>
                    </div>
                    <Link
                      aria-label={`Compare ${lot.name}`}
                      href={`/${locale}${basePath}/compare?lot=${lot.id}`}
                      className="grid size-11 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--forest)]"
                    >
                      <GitCompareArrows size={19} />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
