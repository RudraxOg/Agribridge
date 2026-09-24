export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      asset_sources: {
        Row: {
          attribution_text: string | null
          author: string | null
          id: string
          license_code: string
          license_url: string | null
          metadata: Json
          provider: string
          retrieved_at: string
          source_asset_url: string | null
          source_page_url: string | null
          title: string | null
        }
        Insert: {
          attribution_text?: string | null
          author?: string | null
          id?: string
          license_code: string
          license_url?: string | null
          metadata?: Json
          provider: string
          retrieved_at?: string
          source_asset_url?: string | null
          source_page_url?: string | null
          title?: string | null
        }
        Update: {
          attribution_text?: string | null
          author?: string | null
          id?: string
          license_code?: string
          license_url?: string | null
          metadata?: Json
          provider?: string
          retrieved_at?: string
          source_asset_url?: string | null
          source_page_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          entity_id: string | null
          entity_type: string
          id: string
          new_state: Json | null
          occurred_at: string
          organization_id: string | null
          previous_state: Json | null
          request_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          new_state?: Json | null
          occurred_at?: string
          organization_id?: string | null
          previous_state?: Json | null
          request_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_state?: Json | null
          occurred_at?: string
          organization_id?: string | null
          previous_state?: Json | null
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_events: {
        Row: {
          device_family: string | null
          event_type: string
          id: string
          ip_hash: string | null
          metadata: Json
          occurred_at: string
          organization_id: string | null
          outcome: string
          user_id: string | null
        }
        Insert: {
          device_family?: string | null
          event_type: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          occurred_at?: string
          organization_id?: string | null
          outcome?: string
          user_id?: string | null
        }
        Update: {
          device_family?: string | null
          event_type?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          occurred_at?: string
          organization_id?: string | null
          outcome?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "auth_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_account_references: {
        Row: {
          account_last_four: string
          created_at: string
          id: string
          ifsc_masked: string | null
          organization_id: string
          provider: string
          status: Database["public"]["Enums"]["verification_status"]
          verification_reference: string
          verified_at: string | null
        }
        Insert: {
          account_last_four: string
          created_at?: string
          id?: string
          ifsc_masked?: string | null
          organization_id: string
          provider: string
          status?: Database["public"]["Enums"]["verification_status"]
          verification_reference: string
          verified_at?: string | null
        }
        Update: {
          account_last_four?: string
          created_at?: string
          id?: string
          ifsc_masked?: string | null
          organization_id?: string
          provider?: string
          status?: Database["public"]["Enums"]["verification_status"]
          verification_reference?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_account_references_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "bank_account_references_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_profiles: {
        Row: {
          buyer_type: string | null
          created_at: string
          expected_monthly_quantity_kg: number | null
          organization_id: string
          procurement_preferences: Json
          sourcing_regions: Json
          updated_at: string
        }
        Insert: {
          buyer_type?: string | null
          created_at?: string
          expected_monthly_quantity_kg?: number | null
          organization_id: string
          procurement_preferences?: Json
          sourcing_regions?: Json
          updated_at?: string
        }
        Update: {
          buyer_type?: string | null
          created_at?: string
          expected_monthly_quantity_kg?: number | null
          organization_id?: string
          procurement_preferences?: Json
          sourcing_regions?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "buyer_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_requests: {
        Row: {
          commodity: string
          created_at: string
          created_by: string | null
          delivery_district: string | null
          id: string
          min_grade: string | null
          needed_by: string | null
          organization_id: string
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          status: string
          target_price_paise: number | null
          updated_at: string
        }
        Insert: {
          commodity: string
          created_at?: string
          created_by?: string | null
          delivery_district?: string | null
          id?: string
          min_grade?: string | null
          needed_by?: string | null
          organization_id: string
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          status?: string
          target_price_paise?: number | null
          updated_at?: string
        }
        Update: {
          commodity?: string
          created_at?: string
          created_by?: string | null
          delivery_district?: string | null
          id?: string
          min_grade?: string | null
          needed_by?: string | null
          organization_id?: string
          quantity?: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          status?: string
          target_price_paise?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "buyer_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_reference: string
          certificate_type: string
          created_at: string
          expires_at: string | null
          id: string
          issued_at: string | null
          issuer: string
          organization_id: string
          stock_lot_id: string
          storage_path: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          certificate_reference: string
          certificate_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issuer: string
          organization_id: string
          stock_lot_id: string
          storage_path: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          certificate_reference?: string
          certificate_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          issuer?: string
          organization_id?: string
          stock_lot_id?: string
          storage_path?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_centres: {
        Row: {
          active: boolean
          cold_storage_available: boolean
          created_at: string
          district: string
          id: string
          location: unknown
          name: string
          organization_id: string
          state: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          cold_storage_available?: boolean
          created_at?: string
          district: string
          id?: string
          location: unknown
          name: string
          organization_id: string
          state: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          cold_storage_available?: boolean
          created_at?: string
          district?: string
          id?: string
          location?: unknown
          name?: string
          organization_id?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_centres_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "collection_centres_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          alternative_offered: boolean
          consented: boolean
          id: string
          notice_version: string
          organization_id: string
          purpose: string
          recorded_at: string
          recorded_by: string | null
          subject_profile_id: string | null
          withdrawn_at: string | null
        }
        Insert: {
          alternative_offered?: boolean
          consented: boolean
          id?: string
          notice_version: string
          organization_id: string
          purpose: string
          recorded_at?: string
          recorded_by?: string | null
          subject_profile_id?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          alternative_offered?: boolean
          consented?: boolean
          id?: string
          notice_version?: string
          organization_id?: string
          purpose?: string
          recorded_at?: string
          recorded_by?: string | null
          subject_profile_id?: string | null
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "consent_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_subject_profile_id_fkey"
            columns: ["subject_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_catalog: {
        Row: {
          active: boolean
          created_at: string
          default_quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          id: string
          name: Json
          quality_parameters: Json
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          default_quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          id?: string
          name: Json
          quality_parameters?: Json
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          default_quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          id?: string
          name?: Json
          quality_parameters?: Json
          slug?: string
        }
        Relationships: []
      }
      crop_cycles: {
        Row: {
          commodity: string
          created_at: string
          created_by: string | null
          expected_harvest_end: string
          expected_harvest_start: string
          expected_quantity: number | null
          farmer_id: string
          id: string
          land_parcel_id: string
          organization_id: string
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          sowing_date: string | null
          status: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          commodity: string
          created_at?: string
          created_by?: string | null
          expected_harvest_end: string
          expected_harvest_start: string
          expected_quantity?: number | null
          farmer_id: string
          id?: string
          land_parcel_id: string
          organization_id: string
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          sowing_date?: string | null
          status?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          commodity?: string
          created_at?: string
          created_by?: string | null
          expected_harvest_end?: string
          expected_harvest_start?: string
          expected_quantity?: number | null
          farmer_id?: string
          id?: string
          land_parcel_id?: string
          organization_id?: string
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          sowing_date?: string | null
          status?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_cycles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_cycles_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_cycles_land_parcel_id_fkey"
            columns: ["land_parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "crop_cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_retention_policies: {
        Row: {
          deletion_mode: string
          legal_hold_supported: boolean
          resource_type: string
          retention_days: number
          updated_at: string
        }
        Insert: {
          deletion_mode: string
          legal_hold_supported?: boolean
          resource_type: string
          retention_days: number
          updated_at?: string
        }
        Update: {
          deletion_mode?: string
          legal_hold_supported?: boolean
          resource_type?: string
          retention_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      demo_data_bindings: {
        Row: {
          created_at: string
          demo_scenario_key: string
          entity_id: string
          entity_type: string
          id: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          demo_scenario_key: string
          entity_id: string
          entity_type: string
          id?: string
          organization_id: string
        }
        Update: {
          created_at?: string
          demo_scenario_key?: string
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_data_bindings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "demo_data_bindings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          buyer_organization_id: string
          category: string
          created_at: string
          id: string
          order_id: string
          organization_id: string
          raised_by: string | null
          resolution: string | null
          resolved_at: string | null
          status: string
          summary: string
          updated_at: string
        }
        Insert: {
          buyer_organization_id: string
          category: string
          created_at?: string
          id?: string
          order_id: string
          organization_id: string
          raised_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          summary: string
          updated_at?: string
        }
        Update: {
          buyer_organization_id?: string
          category?: string
          created_at?: string
          id?: string
          order_id?: string
          organization_id?: string
          raised_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          summary?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "disputes_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "disputes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_raised_by_fkey"
            columns: ["raised_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_milestones: {
        Row: {
          amount_paise: number
          created_at: string
          evidence_reference: string | null
          id: string
          milestone: string
          occurred_at: string
          settlement_id: string
          status: string
        }
        Insert: {
          amount_paise?: number
          created_at?: string
          evidence_reference?: string | null
          id?: string
          milestone: string
          occurred_at: string
          settlement_id: string
          status: string
        }
        Update: {
          amount_paise?: number
          created_at?: string
          evidence_reference?: string | null
          id?: string
          milestone?: string
          occurred_at?: string
          settlement_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_milestones_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_auth_methods: {
        Row: {
          consent_record_id: string | null
          created_at: string
          enrolled_at: string | null
          farmer_id: string
          id: string
          method: string
          organization_id: string
          provider: string
          provider_reference: string
          revoked_at: string | null
          status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          consent_record_id?: string | null
          created_at?: string
          enrolled_at?: string | null
          farmer_id: string
          id?: string
          method: string
          organization_id: string
          provider: string
          provider_reference: string
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          consent_record_id?: string | null
          created_at?: string
          enrolled_at?: string | null
          farmer_id?: string
          id?: string
          method?: string
          organization_id?: string
          provider?: string
          provider_reference?: string
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "farmer_auth_methods_consent_record_id_fkey"
            columns: ["consent_record_id"]
            isOneToOne: false
            referencedRelation: "consent_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_auth_methods_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_auth_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "farmer_auth_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_payouts: {
        Row: {
          bank_account_reference_id: string | null
          created_at: string
          deductions_paise: number
          farmer_id: string
          gross_paise: number
          id: string
          lot_contributor_id: string
          net_paise: number
          provider_reference: string | null
          settlement_id: string
          status: string
        }
        Insert: {
          bank_account_reference_id?: string | null
          created_at?: string
          deductions_paise?: number
          farmer_id: string
          gross_paise: number
          id?: string
          lot_contributor_id: string
          net_paise: number
          provider_reference?: string | null
          settlement_id: string
          status?: string
        }
        Update: {
          bank_account_reference_id?: string | null
          created_at?: string
          deductions_paise?: number
          farmer_id?: string
          gross_paise?: number
          id?: string
          lot_contributor_id?: string
          net_paise?: number
          provider_reference?: string | null
          settlement_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_payouts_bank_account_reference_id_fkey"
            columns: ["bank_account_reference_id"]
            isOneToOne: false
            referencedRelation: "bank_account_references"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_payouts_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_payouts_lot_contributor_id_fkey"
            columns: ["lot_contributor_id"]
            isOneToOne: false
            referencedRelation: "lot_contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_payouts_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      farmers: {
        Row: {
          bank_account_reference_id: string | null
          created_at: string
          created_by: string | null
          district: string
          farmer_code: string
          full_name: string
          id: string
          identity_verification_id: string | null
          organization_id: string
          phone_masked: string | null
          preferred_locale: string
          state: string
          updated_at: string
          village: string
        }
        Insert: {
          bank_account_reference_id?: string | null
          created_at?: string
          created_by?: string | null
          district: string
          farmer_code: string
          full_name: string
          id?: string
          identity_verification_id?: string | null
          organization_id: string
          phone_masked?: string | null
          preferred_locale?: string
          state: string
          updated_at?: string
          village: string
        }
        Update: {
          bank_account_reference_id?: string | null
          created_at?: string
          created_by?: string | null
          district?: string
          farmer_code?: string
          full_name?: string
          id?: string
          identity_verification_id?: string | null
          organization_id?: string
          phone_masked?: string | null
          preferred_locale?: string
          state?: string
          updated_at?: string
          village?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmers_bank_account_reference_id_fkey"
            columns: ["bank_account_reference_id"]
            isOneToOne: false
            referencedRelation: "bank_account_references"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_identity_verification_id_fkey"
            columns: ["identity_verification_id"]
            isOneToOne: false
            referencedRelation: "identity_verifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "farmers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_rules: {
        Row: {
          active: boolean
          basis: string
          bearer: string
          code: string
          created_at: string
          effective_from: string
          effective_until: string | null
          id: string
          label: string
          value: number
        }
        Insert: {
          active?: boolean
          basis: string
          bearer: string
          code: string
          created_at?: string
          effective_from: string
          effective_until?: string | null
          id?: string
          label: string
          value: number
        }
        Update: {
          active?: boolean
          basis?: string
          bearer?: string
          code?: string
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          label?: string
          value?: number
        }
        Relationships: []
      }
      file_assets: {
        Row: {
          alt_text: Json
          bucket: string
          byte_size: number
          checksum_sha256: string
          created_at: string
          deleted_at: string | null
          height: number | null
          id: string
          is_synthetic: boolean
          legal_hold: boolean
          metadata: Json
          mime_type: string
          object_path: string
          original_filename: string | null
          owner_organization_id: string | null
          processing_status: string
          purpose: string
          quarantine_status: string
          retention_expires_at: string | null
          scan_provider: string | null
          scanned_at: string | null
          source_id: string | null
          visibility: string
          width: number | null
        }
        Insert: {
          alt_text?: Json
          bucket: string
          byte_size: number
          checksum_sha256: string
          created_at?: string
          deleted_at?: string | null
          height?: number | null
          id?: string
          is_synthetic?: boolean
          legal_hold?: boolean
          metadata?: Json
          mime_type: string
          object_path: string
          original_filename?: string | null
          owner_organization_id?: string | null
          processing_status?: string
          purpose: string
          quarantine_status?: string
          retention_expires_at?: string | null
          scan_provider?: string | null
          scanned_at?: string | null
          source_id?: string | null
          visibility: string
          width?: number | null
        }
        Update: {
          alt_text?: Json
          bucket?: string
          byte_size?: number
          checksum_sha256?: string
          created_at?: string
          deleted_at?: string | null
          height?: number | null
          id?: string
          is_synthetic?: boolean
          legal_hold?: boolean
          metadata?: Json
          mime_type?: string
          object_path?: string
          original_filename?: string | null
          owner_organization_id?: string | null
          processing_status?: string
          purpose?: string
          quarantine_status?: string
          retention_expires_at?: string | null
          scan_provider?: string | null
          scanned_at?: string | null
          source_id?: string | null
          visibility?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "file_assets_owner_organization_id_fkey"
            columns: ["owner_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "file_assets_owner_organization_id_fkey"
            columns: ["owner_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_assets_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "asset_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      forecasts: {
        Row: {
          buyer_segment: string | null
          commodity: string
          confidence: number
          created_at: string
          district: string
          drivers: Json
          expected_demand: string
          expected_max_price_paise: number
          expected_min_price_paise: number
          horizon_days: number
          id: string
          organization_id: string
          recommended_harvest_window: unknown
          source_date: string
          supply_pressure: string
          synced_at: string
        }
        Insert: {
          buyer_segment?: string | null
          commodity: string
          confidence: number
          created_at?: string
          district: string
          drivers?: Json
          expected_demand: string
          expected_max_price_paise: number
          expected_min_price_paise: number
          horizon_days: number
          id?: string
          organization_id: string
          recommended_harvest_window?: unknown
          source_date: string
          supply_pressure: string
          synced_at: string
        }
        Update: {
          buyer_segment?: string | null
          commodity?: string
          confidence?: number
          created_at?: string
          district?: string
          drivers?: Json
          expected_demand?: string
          expected_max_price_paise?: number
          expected_min_price_paise?: number
          horizon_days?: number
          id?: string
          organization_id?: string
          recommended_harvest_window?: unknown
          source_date?: string
          supply_pressure?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forecasts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "forecasts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fpo_profiles: {
        Row: {
          created_at: string
          farmer_count_estimate: number | null
          organization_id: string
          primary_crops: Json
          settlement_preferences: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          farmer_count_estimate?: number | null
          organization_id: string
          primary_crops?: Json
          settlement_preferences?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          farmer_count_estimate?: number | null
          organization_id?: string
          primary_crops?: Json
          settlement_preferences?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fpo_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "fpo_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      grading_parameters: {
        Row: {
          created_at: string
          grading_report_id: string
          id: string
          numeric_value: number | null
          parameter: string
          text_value: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          grading_report_id: string
          id?: string
          numeric_value?: number | null
          parameter: string
          text_value?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          grading_report_id?: string
          id?: string
          numeric_value?: number | null
          parameter?: string
          text_value?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grading_parameters_grading_report_id_fkey"
            columns: ["grading_report_id"]
            isOneToOne: false
            referencedRelation: "grading_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      grading_reports: {
        Row: {
          analyzed_at: string | null
          confidence: number | null
          created_at: string
          created_by: string | null
          human_override: string | null
          id: string
          model_version: string | null
          organization_id: string
          source: string
          stock_lot_id: string
          suggested_grade: string
          warnings: Json
        }
        Insert: {
          analyzed_at?: string | null
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          human_override?: string | null
          id?: string
          model_version?: string | null
          organization_id: string
          source: string
          stock_lot_id: string
          suggested_grade: string
          warnings?: Json
        }
        Update: {
          analyzed_at?: string | null
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          human_override?: string | null
          id?: string
          model_version?: string | null
          organization_id?: string
          source?: string
          stock_lot_id?: string
          suggested_grade?: string
          warnings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "grading_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grading_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "grading_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grading_reports_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grading_reports_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_demo_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          run_id: string
          step_key: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          run_id: string
          step_key: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          run_id?: string
          step_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "guided_demo_events_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "guided_demo_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      guided_demo_runs: {
        Row: {
          completed_at: string | null
          exited_at: string | null
          id: string
          mode: string
          organization_id: string | null
          started_at: string
          status: string
          tour_key: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          exited_at?: string | null
          id?: string
          mode?: string
          organization_id?: string | null
          started_at?: string
          status?: string
          tour_key: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          exited_at?: string | null
          id?: string
          mode?: string
          organization_id?: string | null
          started_at?: string
          status?: string
          tour_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guided_demo_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "guided_demo_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guided_demo_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_verifications: {
        Row: {
          consent_record_id: string
          created_at: string
          id: string
          last_four: string | null
          masked_identifier: string
          organization_id: string
          provider: string
          status: Database["public"]["Enums"]["verification_status"]
          verification_reference: string
          verified_at: string | null
        }
        Insert: {
          consent_record_id: string
          created_at?: string
          id?: string
          last_four?: string | null
          masked_identifier: string
          organization_id: string
          provider: string
          status: Database["public"]["Enums"]["verification_status"]
          verification_reference: string
          verified_at?: string | null
        }
        Update: {
          consent_record_id?: string
          created_at?: string
          id?: string
          last_four?: string | null
          masked_identifier?: string
          organization_id?: string
          provider?: string
          status?: Database["public"]["Enums"]["verification_status"]
          verification_reference?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_verifications_consent_record_id_fkey"
            columns: ["consent_record_id"]
            isOneToOne: false
            referencedRelation: "consent_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_verifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "identity_verifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      land_documents: {
        Row: {
          created_at: string
          document_type: string
          farmer_id: string
          file_asset_id: string
          id: string
          land_parcel_id: string | null
          masked_reference: string | null
          organization_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          document_type: string
          farmer_id: string
          file_asset_id: string
          id?: string
          land_parcel_id?: string | null
          masked_reference?: string | null
          organization_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          document_type?: string
          farmer_id?: string
          file_asset_id?: string
          id?: string
          land_parcel_id?: string | null
          masked_reference?: string | null
          organization_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "land_documents_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_documents_file_asset_id_fkey"
            columns: ["file_asset_id"]
            isOneToOne: false
            referencedRelation: "file_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_documents_land_parcel_id_fkey"
            columns: ["land_parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "land_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      land_parcels: {
        Row: {
          area: number
          area_unit: string
          created_at: string
          created_by: string | null
          farmer_id: string
          id: string
          khatauni_reference_masked: string | null
          latitude: number | null
          location: unknown
          longitude: number | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          area: number
          area_unit: string
          created_at?: string
          created_by?: string | null
          farmer_id: string
          id?: string
          khatauni_reference_masked?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          area?: number
          area_unit?: string
          created_at?: string
          created_by?: string | null
          farmer_id?: string
          id?: string
          khatauni_reference_masked?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "land_parcels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_parcels_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "land_parcels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "land_parcels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_profiles: {
        Row: {
          cold_storage_available: boolean
          created_at: string
          fleet_size: number | null
          operating_hours: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          cold_storage_available?: boolean
          created_at?: string
          fleet_size?: number | null
          operating_hours?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          cold_storage_available?: boolean
          created_at?: string
          fleet_size?: number | null
          operating_hours?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "logistics_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "logistics_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_quotes: {
        Row: {
          available_count: number
          capacity: number
          capacity_unit: Database["public"]["Enums"]["quantity_unit"]
          created_at: string
          estimated_delivery: string
          estimated_pickup: string
          expires_at: string | null
          freight_paise: number
          id: string
          insurance_included: boolean
          order_id: string
          provider: string
          provider_reference: string | null
          rating: number | null
          refrigerated: boolean
          vehicle_type: string
        }
        Insert: {
          available_count?: number
          capacity: number
          capacity_unit: Database["public"]["Enums"]["quantity_unit"]
          created_at?: string
          estimated_delivery: string
          estimated_pickup: string
          expires_at?: string | null
          freight_paise: number
          id?: string
          insurance_included?: boolean
          order_id: string
          provider: string
          provider_reference?: string | null
          rating?: number | null
          refrigerated?: boolean
          vehicle_type: string
        }
        Update: {
          available_count?: number
          capacity?: number
          capacity_unit?: Database["public"]["Enums"]["quantity_unit"]
          created_at?: string
          estimated_delivery?: string
          estimated_pickup?: string
          expires_at?: string | null
          freight_paise?: number
          id?: string
          insurance_included?: boolean
          order_id?: string
          provider?: string
          provider_reference?: string | null
          rating?: number | null
          refrigerated?: boolean
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "logistics_quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_service_areas: {
        Row: {
          created_at: string
          district: string
          id: string
          latitude: number | null
          longitude: number | null
          organization_id: string
          state: string
        }
        Insert: {
          created_at?: string
          district: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          organization_id: string
          state: string
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          organization_id?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "logistics_service_areas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "logistics_service_areas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_contributors: {
        Row: {
          created_at: string
          farmer_id: string
          id: string
          organization_id: string
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id: string
        }
        Insert: {
          created_at?: string
          farmer_id: string
          id?: string
          organization_id: string
          quantity: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id: string
        }
        Update: {
          created_at?: string
          farmer_id?: string
          id?: string
          organization_id?: string
          quantity?: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lot_contributors_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_contributors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "lot_contributors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_contributors_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_contributors_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_media: {
        Row: {
          angle_degrees: number | null
          created_at: string
          created_by: string | null
          id: string
          media_type: string
          organization_id: string
          stock_lot_id: string
          storage_path: string
        }
        Insert: {
          angle_degrees?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          media_type: string
          organization_id: string
          stock_lot_id: string
          storage_path: string
        }
        Update: {
          angle_degrees?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          media_type?: string
          organization_id?: string
          stock_lot_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "lot_media_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_media_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "lot_media_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_media_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_media_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_path: string | null
          body: string
          created_at: string
          id: string
          organization_id: string
          profile_id: string | null
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          action_path?: string | null
          body: string
          created_at?: string
          id?: string
          organization_id: string
          profile_id?: string | null
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          action_path?: string | null
          body?: string
          created_at?: string
          id?: string
          organization_id?: string
          profile_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step_key: string | null
          current_tour_key: string | null
          guided_demo_role_key: string | null
          guided_demo_status: string
          id: string
          last_seen_at: string
          organization_complete_at: string | null
          organization_id: string | null
          profile_complete_at: string | null
          selected_experience: string | null
          skipped_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step_key?: string | null
          current_tour_key?: string | null
          guided_demo_role_key?: string | null
          guided_demo_status?: string
          id?: string
          last_seen_at?: string
          organization_complete_at?: string | null
          organization_id?: string | null
          profile_complete_at?: string | null
          selected_experience?: string | null
          skipped_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step_key?: string | null
          current_tour_key?: string | null
          guided_demo_role_key?: string | null
          guided_demo_status?: string
          id?: string
          last_seen_at?: string
          organization_complete_at?: string | null
          organization_id?: string | null
          profile_complete_at?: string | null
          selected_experience?: string | null
          skipped_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "onboarding_progress_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_charges: {
        Row: {
          amount_paise: number
          bearer: string
          code: string
          created_at: string
          fee_rule_id: string | null
          id: string
          label: string
          order_id: string
        }
        Insert: {
          amount_paise: number
          bearer: string
          code: string
          created_at?: string
          fee_rule_id?: string | null
          id?: string
          label: string
          order_id: string
        }
        Update: {
          amount_paise?: number
          bearer?: string
          code?: string
          created_at?: string
          fee_rule_id?: string | null
          id?: string
          label?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_charges_fee_rule_id_fkey"
            columns: ["fee_rule_id"]
            isOneToOne: false
            referencedRelation: "fee_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_charges_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_paise: number
          order_id: string
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id: string
          unit_price_paise: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_paise: number
          order_id: string
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id: string
          unit_price_paise: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total_paise?: number
          order_id?: string
          quantity?: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          stock_lot_id?: string
          unit_price_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      order_price_snapshots: {
        Row: {
          adjustments_paise: number
          agribridge_share_paise: number
          buyer_payable_paise: number
          calculation_inputs: Json
          calculator_version: string
          created_at: string
          farmer_pool_paise: number
          first_release_paise: number
          fpo_share_paise: number
          id: string
          insurance_paise: number
          logistics_paise: number
          order_id: string
          produce_subtotal_paise: number
          second_release_paise: number
          statutory_charges_paise: number
        }
        Insert: {
          adjustments_paise?: number
          agribridge_share_paise: number
          buyer_payable_paise: number
          calculation_inputs: Json
          calculator_version: string
          created_at?: string
          farmer_pool_paise: number
          first_release_paise: number
          fpo_share_paise: number
          id?: string
          insurance_paise?: number
          logistics_paise: number
          order_id: string
          produce_subtotal_paise: number
          second_release_paise: number
          statutory_charges_paise?: number
        }
        Update: {
          adjustments_paise?: number
          agribridge_share_paise?: number
          buyer_payable_paise?: number
          calculation_inputs?: Json
          calculator_version?: string
          created_at?: string
          farmer_pool_paise?: number
          first_release_paise?: number
          fpo_share_paise?: number
          id?: string
          insurance_paise?: number
          logistics_paise?: number
          order_id?: string
          produce_subtotal_paise?: number
          second_release_paise?: number
          statutory_charges_paise?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_price_snapshots_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_organization_id: string
          buyer_payable_paise: number
          created_at: string
          created_by: string | null
          currency: string
          id: string
          net_farmer_payout_paise: number
          order_number: string
          organization_id: string
          placed_at: string | null
          produce_value_paise: number
          status: string
          updated_at: string
        }
        Insert: {
          buyer_organization_id: string
          buyer_payable_paise: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          net_farmer_payout_paise: number
          order_number: string
          organization_id: string
          placed_at?: string | null
          produce_value_paise: number
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_organization_id?: string
          buyer_payable_paise?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          net_farmer_payout_paise?: number
          order_number?: string
          organization_id?: string
          placed_at?: string | null
          produce_value_paise?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "orders_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email_normalized: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          revoked_at: string | null
          role_id: string
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email_normalized: string
          expires_at: string
          id?: string
          invited_by: string
          organization_id: string
          revoked_at?: string | null
          role_id: string
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email_normalized?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          revoked_at?: string | null
          role_id?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          active: boolean
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          profile_id: string
          revoked_at: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          role_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          profile_id: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          profile_id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          district: string
          id: string
          name: string
          slug: string
          state: string
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          address?: string | null
          created_at?: string
          district: string
          id?: string
          name: string
          slug: string
          state: string
          type: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          address?: string | null
          created_at?: string
          district?: string
          id?: string
          name?: string
          slug?: string
          state?: string
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount_paise: number
          created_at: string
          currency: string
          event_type: string
          id: string
          occurred_at: string
          order_id: string
          payload_hash: string | null
          provider: string
          provider_event_id: string
          provider_payment_reference: string | null
          status: string
        }
        Insert: {
          amount_paise: number
          created_at?: string
          currency?: string
          event_type: string
          id?: string
          occurred_at: string
          order_id: string
          payload_hash?: string | null
          provider: string
          provider_event_id: string
          provider_payment_reference?: string | null
          status: string
        }
        Update: {
          amount_paise?: number
          created_at?: string
          currency?: string
          event_type?: string
          id?: string
          occurred_at?: string
          order_id?: string
          payload_hash?: string | null
          provider?: string
          provider_event_id?: string
          provider_payment_reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          key: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      platform_role_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          revoked_at: string | null
          role_id: string
          status: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          revoked_at?: string | null
          role_id: string
          status?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          revoked_at?: string | null
          role_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_jobs: {
        Row: {
          attempts: number
          available_at: string
          created_at: string
          error_code: string | null
          file_asset_id: string | null
          id: string
          job_type: string
          locked_at: string | null
          organization_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          available_at?: string
          created_at?: string
          error_code?: string | null
          file_asset_id?: string | null
          id?: string
          job_type: string
          locked_at?: string | null
          organization_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          available_at?: string
          created_at?: string
          error_code?: string | null
          file_asset_id?: string | null
          id?: string
          job_type?: string
          locked_at?: string | null
          organization_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_file_asset_id_fkey"
            columns: ["file_asset_id"]
            isOneToOne: false
            referencedRelation: "file_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processing_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "processing_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          full_name: string
          id: string
          last_organization_id: string | null
          phone_masked: string | null
          preferred_locale: string
          signup_intent: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          full_name: string
          id: string
          last_organization_id?: string | null
          phone_masked?: string | null
          preferred_locale?: string
          signup_intent?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          full_name?: string
          id?: string
          last_organization_id?: string | null
          phone_masked?: string | null
          preferred_locale?: string
          signup_intent?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_last_organization_id_fkey"
            columns: ["last_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "profiles_last_organization_id_fkey"
            columns: ["last_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          encrypted_subscription: Json
          endpoint_hash: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          encrypted_subscription: Json
          endpoint_hash: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          encrypted_subscription?: Json
          endpoint_hash?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_counters: {
        Row: {
          expires_at: string
          hit_count: number
          namespace: string
          subject_hash: string
          window_started_at: string
        }
        Insert: {
          expires_at: string
          hit_count?: number
          namespace: string
          subject_hash: string
          window_started_at: string
        }
        Update: {
          expires_at?: string
          hit_count?: number
          namespace?: string
          subject_hash?: string
          window_started_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string
          id: string
          key: string
          label: string
          requires_mfa: boolean
          scope: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          key: string
          label: string
          requires_mfa?: boolean
          scope: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key?: string
          label?: string
          requires_mfa?: boolean
          scope?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          event_type: string
          id: string
          metadata: Json
          occurred_at: string
          organization_id: string | null
          resource_id: string | null
          resource_type: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "security_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sensitive_access_events: {
        Row: {
          actor_user_id: string | null
          id: string
          occurred_at: string
          organization_id: string | null
          outcome: string
          permission_key: string
          purpose: string
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          actor_user_id?: string | null
          id?: string
          occurred_at?: string
          organization_id?: string | null
          outcome: string
          permission_key: string
          purpose: string
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          actor_user_id?: string | null
          id?: string
          occurred_at?: string
          organization_id?: string | null
          outcome?: string
          permission_key?: string
          purpose?: string
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensitive_access_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sensitive_access_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "sensitive_access_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          created_at: string
          first_release_paise: number
          id: string
          order_id: string
          provider_reference: string | null
          second_release_paise: number
          secured_paise: number
          state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_release_paise?: number
          id?: string
          order_id: string
          provider_reference?: string | null
          second_release_paise?: number
          secured_paise?: number
          state?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_release_paise?: number
          id?: string
          order_id?: string
          provider_reference?: string | null
          second_release_paise?: number
          secured_paise?: number
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_positions: {
        Row: {
          created_at: string
          heading_degrees: number | null
          id: string
          logistics_organization_id: string
          position: unknown
          provider_recorded_at: string
          recorded_by: string
          shipment_id: string
          speed_kph: number | null
        }
        Insert: {
          created_at?: string
          heading_degrees?: number | null
          id?: string
          logistics_organization_id: string
          position: unknown
          provider_recorded_at: string
          recorded_by?: string
          shipment_id: string
          speed_kph?: number | null
        }
        Update: {
          created_at?: string
          heading_degrees?: number | null
          id?: string
          logistics_organization_id?: string
          position?: unknown
          provider_recorded_at?: string
          recorded_by?: string
          shipment_id?: string
          speed_kph?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_positions_logistics_organization_id_fkey"
            columns: ["logistics_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "shipment_positions_logistics_organization_id_fkey"
            columns: ["logistics_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_positions_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_positions_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          assigned_driver_user_id: string | null
          buyer_organization_id: string
          created_at: string
          current_latitude: number | null
          current_longitude: number | null
          delivery_proof_path: string | null
          driver_name: string | null
          driver_phone_masked: string | null
          estimated_delivery: string | null
          gps_updated_at: string | null
          id: string
          logistics_organization_id: string | null
          logistics_quote_id: string | null
          order_id: string
          organization_id: string
          provider: string
          status: string
          temperature_celsius: number | null
          tracking_reference: string | null
          updated_at: string
          vehicle_number: string | null
        }
        Insert: {
          assigned_driver_user_id?: string | null
          buyer_organization_id: string
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          delivery_proof_path?: string | null
          driver_name?: string | null
          driver_phone_masked?: string | null
          estimated_delivery?: string | null
          gps_updated_at?: string | null
          id?: string
          logistics_organization_id?: string | null
          logistics_quote_id?: string | null
          order_id: string
          organization_id: string
          provider?: string
          status?: string
          temperature_celsius?: number | null
          tracking_reference?: string | null
          updated_at?: string
          vehicle_number?: string | null
        }
        Update: {
          assigned_driver_user_id?: string | null
          buyer_organization_id?: string
          created_at?: string
          current_latitude?: number | null
          current_longitude?: number | null
          delivery_proof_path?: string | null
          driver_name?: string | null
          driver_phone_masked?: string | null
          estimated_delivery?: string | null
          gps_updated_at?: string | null
          id?: string
          logistics_organization_id?: string | null
          logistics_quote_id?: string | null
          order_id?: string
          organization_id?: string
          provider?: string
          status?: string
          temperature_celsius?: number | null
          tracking_reference?: string | null
          updated_at?: string
          vehicle_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_assigned_driver_user_id_fkey"
            columns: ["assigned_driver_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "shipments_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_logistics_organization_id_fkey"
            columns: ["logistics_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "shipments_logistics_organization_id_fkey"
            columns: ["logistics_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_logistics_quote_id_fkey"
            columns: ["logistics_quote_id"]
            isOneToOne: false
            referencedRelation: "logistics_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "shipments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_lot_assets: {
        Row: {
          created_at: string
          file_asset_id: string
          id: string
          is_cover: boolean
          organization_id: string
          position: number
          stock_lot_id: string
          view_angle: number | null
        }
        Insert: {
          created_at?: string
          file_asset_id: string
          id?: string
          is_cover?: boolean
          organization_id: string
          position?: number
          stock_lot_id: string
          view_angle?: number | null
        }
        Update: {
          created_at?: string
          file_asset_id?: string
          id?: string
          is_cover?: boolean
          organization_id?: string
          position?: number
          stock_lot_id?: string
          view_angle?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_lot_assets_file_asset_id_fkey"
            columns: ["file_asset_id"]
            isOneToOne: false
            referencedRelation: "file_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_lot_assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "stock_lot_assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_lot_assets_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_lot_assets_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_lots: {
        Row: {
          available_quantity: number
          commodity: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          harvest_date: string | null
          id: string
          lot_code: string
          organization_id: string
          published_at: string | null
          quantity: number
          quantity_unit: Database["public"]["Enums"]["quantity_unit"]
          status: string
          unit_price_paise: number
          updated_at: string
          variety: string | null
        }
        Insert: {
          available_quantity: number
          commodity: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          harvest_date?: string | null
          id?: string
          lot_code: string
          organization_id: string
          published_at?: string | null
          quantity: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          status?: string
          unit_price_paise: number
          updated_at?: string
          variety?: string | null
        }
        Update: {
          available_quantity?: number
          commodity?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          harvest_date?: string | null
          id?: string
          lot_code?: string
          organization_id?: string
          published_at?: string | null
          quantity?: number
          quantity_unit?: Database["public"]["Enums"]["quantity_unit"]
          status?: string
          unit_price_paise?: number
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_lots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "stock_lots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          label: string
          latitude: number | null
          longitude: number | null
          provider_recorded_at: string | null
          shipment_id: string
          temperature_celsius: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          label: string
          latitude?: number | null
          longitude?: number | null
          provider_recorded_at?: string | null
          shipment_id: string
          temperature_celsius?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          label?: string
          latitude?: number | null
          longitude?: number | null
          provider_recorded_at?: string | null
          shipment_id?: string
          temperature_celsius?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      video_calls: {
        Row: {
          buyer_organization_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          organization_id: string
          provider: string
          provider_room_reference: string | null
          scheduled_at: string
          status: string
          stock_lot_id: string
        }
        Insert: {
          buyer_organization_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          provider?: string
          provider_room_reference?: string | null
          scheduled_at: string
          status?: string
          stock_lot_id: string
        }
        Update: {
          buyer_organization_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          provider?: string
          provider_room_reference?: string | null
          scheduled_at?: string
          status?: string
          stock_lot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_calls_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "video_calls_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_calls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_calls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["fpo_organization_id"]
          },
          {
            foreignKeyName: "video_calls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_calls_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_calls_stock_lot_id_fkey"
            columns: ["stock_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          error_code: string | null
          id: string
          payload_sha256: string
          processed_at: string | null
          processing_status: string
          provider: string
          provider_event_id: string
          received_at: string
          signature_verified: boolean
        }
        Insert: {
          error_code?: string | null
          id?: string
          payload_sha256: string
          processed_at?: string | null
          processing_status?: string
          provider: string
          provider_event_id: string
          received_at?: string
          signature_verified: boolean
        }
        Update: {
          error_code?: string | null
          id?: string
          payload_sha256?: string
          processed_at?: string | null
          processing_status?: string
          provider?: string
          provider_event_id?: string
          received_at?: string
          signature_verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      marketplace_listings: {
        Row: {
          available_quantity: number | null
          commodity: string | null
          district: string | null
          expires_at: string | null
          fpo_name: string | null
          fpo_organization_id: string | null
          grade: string | null
          grading_confidence: number | null
          harvest_date: string | null
          id: string | null
          lot_code: string | null
          quantity_unit: Database["public"]["Enums"]["quantity_unit"] | null
          state: string | null
          unit_price_paise: number | null
          variety: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_organization_invitation: {
        Args: { invitation_token: string }
        Returns: string
      }
      append_audit_event: {
        Args: {
          p_action: string
          p_entity_id: string
          p_entity_type: string
          p_new: Json
          p_organization_id: string
          p_previous: Json
        }
        Returns: string
      }
      claim_processing_jobs: {
        Args: { max_jobs?: number }
        Returns: {
          attempts: number
          available_at: string
          created_at: string
          error_code: string | null
          file_asset_id: string | null
          id: string
          job_type: string
          locked_at: string | null
          organization_id: string | null
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "processing_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      consume_rate_limit: {
        Args: {
          limit_namespace: string
          limit_subject_hash: string
          max_hits: number
          window_seconds: number
        }
        Returns: boolean
      }
      create_organization_from_signup_intent: {
        Args: {
          p_onboarding_data?: Json
          p_organization_name: string
          p_signup_intent: string
          p_slug: string
        }
        Returns: {
          organization_id: string
          organization_slug: string
          role_key: string
        }[]
      }
      create_organization_with_owner: {
        Args: {
          organization_district: string
          organization_kind: string
          organization_name: string
          organization_slug: string
          organization_state: string
        }
        Returns: string
      }
      current_organization_id: { Args: never; Returns: string }
      current_user_has_recent_mfa: { Args: never; Returns: boolean }
      current_user_has_verified_email: { Args: never; Returns: boolean }
      ensure_demo_scenario: {
        Args: { scenario_key?: string; target_organization_id: string }
        Returns: undefined
      }
      has_org_role: {
        Args: { allowed: Database["public"]["Enums"]["app_role"][] }
        Returns: boolean
      }
      has_organization_permission: {
        Args: { required_permission: string; target_organization_id: string }
        Returns: boolean
      }
      has_platform_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      is_active_organization_member: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
      manage_organization_member: {
        Args: {
          member_action: string
          target_membership_id: string
          target_organization_id: string
          target_role_key?: string
        }
        Returns: boolean
      }
      record_sensitive_access: {
        Args: {
          access_purpose: string
          required_permission: string
          target_organization_id: string
          target_resource_id: string
          target_resource_type: string
        }
        Returns: boolean
      }
      run_retention_maintenance: { Args: never; Returns: Json }
    }
    Enums: {
      app_role:
        | "fpo_admin"
        | "fpo_operator"
        | "buyer_admin"
        | "buyer_operator"
        | "assisted_farmer"
      organization_type: "fpo" | "buyer" | "logistics"
      quantity_unit: "kg" | "quintal" | "tonne"
      verification_status: "pending" | "verified" | "failed" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: [
        "fpo_admin",
        "fpo_operator",
        "buyer_admin",
        "buyer_operator",
        "assisted_farmer",
      ],
      organization_type: ["fpo", "buyer", "logistics"],
      quantity_unit: ["kg", "quintal", "tonne"],
      verification_status: ["pending", "verified", "failed", "expired"],
    },
  },
} as const
