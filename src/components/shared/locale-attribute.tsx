"use client";
import { useEffect } from "react";
export function LocaleAttribute({locale}:{locale:string}){useEffect(()=>{document.documentElement.lang=locale},[locale]);return null}
