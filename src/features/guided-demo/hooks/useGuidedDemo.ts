"use client";
import { useContext } from "react";
import { GuidedDemoContext } from "../components/GuidedDemoProvider";
export function useGuidedDemo(){const context=useContext(GuidedDemoContext);if(!context)throw new Error("GuidedDemoProvider is missing");return context;}
