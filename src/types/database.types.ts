export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      AssignmentSheet: {
        Row: {
          assigned_data: Json;
          end_date: string;
          id: string;
          start_date: string;
        };
        Insert: {
          assigned_data: Json;
          end_date: string;
          id?: string;
          start_date: string;
        };
        Update: {
          assigned_data?: Json;
          end_date?: string;
          id?: string;
          start_date?: string;
        };
        Relationships: [];
      };
      Category: {
        Row: {
          id: string;
          name: string;
          rotation_assignment_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          rotation_assignment_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          rotation_assignment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_Category_rotation_assignment_id_fkey';
            columns: ['rotation_assignment_id'];
            isOneToOne: false;
            referencedRelation: 'RotationAssignment';
            referencedColumns: ['id'];
          },
        ];
      };
      RotationAssignment: {
        Row: {
          id: string;
          rotation_cycle: number;
          share_house_id: string;
        };
        Insert: {
          id?: string;
          rotation_cycle: number;
          share_house_id: string;
        };
        Update: {
          id?: string;
          rotation_cycle?: number;
          share_house_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_RotationAssignment_share_house_id_fkey';
            columns: ['share_house_id'];
            isOneToOne: true;
            referencedRelation: 'ShareHouse';
            referencedColumns: ['id'];
          },
        ];
      };
      ShareHouse: {
        Row: {
          assignment_sheet_id: string;
          id: string;
          landlord_id: string;
          name: string;
        };
        Insert: {
          assignment_sheet_id: string;
          id?: string;
          landlord_id?: string;
          name: string;
        };
        Update: {
          assignment_sheet_id?: string;
          id?: string;
          landlord_id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_ShareHouse_assignment_sheet_id_fkey';
            columns: ['assignment_sheet_id'];
            isOneToOne: true;
            referencedRelation: 'AssignmentSheet';
            referencedColumns: ['id'];
          },
        ];
      };
      Task: {
        Row: {
          category_id: string | null;
          description: Json;
          id: string;
          title: string;
        };
        Insert: {
          category_id?: string | null;
          description: Json;
          id?: string;
          title: string;
        };
        Update: {
          category_id?: string | null;
          description?: Json;
          id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'public_Task_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'Category';
            referencedColumns: ['id'];
          },
        ];
      };
      Tenant: {
        Row: {
          email: string;
          extra_assigned_count: number;
          id: string;
          name: string;
        };
        Insert: {
          email: string;
          extra_assigned_count?: number;
          id?: string;
          name: string;
        };
        Update: {
          email?: string;
          extra_assigned_count?: number;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      TenantPlaceholder: {
        Row: {
          index: number;
          rotation_assignment_id: string;
          tenant_id: string | null;
        };
        Insert: {
          index?: number;
          rotation_assignment_id: string;
          tenant_id?: string | null;
        };
        Update: {
          index?: number;
          rotation_assignment_id?: string;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_TenantPlaceholder_rotation_assignment_id_fkey';
            columns: ['rotation_assignment_id'];
            isOneToOne: false;
            referencedRelation: 'RotationAssignment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_TenantPlaceholder_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: true;
            referencedRelation: 'Tenant';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
