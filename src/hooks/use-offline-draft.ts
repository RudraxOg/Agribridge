"use client";
import { useEffect, useState } from "react";
import { loadDraft,removeDraft,saveDraft } from "@/lib/offline/draft-queue";
export function useOfflineDraft<T>(key: string, initial: T) { const [value,setValue]=useState<T>(initial); const [restored,setRestored]=useState(false); useEffect(()=>{ let active=true;void loadDraft<T>(key).then(saved=>{if(active&&saved)setValue(saved)}).finally(()=>{if(active)setRestored(true)});return()=>{active=false};},[key]); function save(next:T){ setValue(next);void saveDraft(key,key.startsWith("farmer")?"farmer":"stock",next); } function clear(){void removeDraft(key);} return {value,save,clear,restored}; }
