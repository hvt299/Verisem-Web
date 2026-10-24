import { CompanyStatus } from "./common";
import { LocationDetail } from "./job";

export interface KYCDocument {
    document_type: string;
    file_url: string; // FIX: Đồng bộ với backend (trước đây là document_url)
    uploaded_at?: string;
}

export interface SocialLinks {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
}

export interface Company {
    id: string;
    name: string;
    tax_code: string;
    owner_user_id: string;
    status: CompanyStatus;
    rejection_reason?: string;

    industries?: string[];
    size?: string;
    website?: string;
    location?: LocationDetail;

    logo_url?: string;
    banner_url?: string;
    description?: string;

    // Các trường mới bổ sung
    gallery_urls?: string[];
    social_links?: SocialLinks;
    benefits?: string[];

    legal_representative_name?: string;
    kyc_documents?: KYCDocument[];

    verified_at?: string;
    verified_by_admin_id?: string;

    view_count: number;
    avg_rating: number;
    review_count: number;

    current_plan_id?: string;
    subscription_expires_at?: string;
    credits_remaining: number;

    created_at: string;
    updated_at?: string;
    active_jobs_count?: number;
    jobs_count?: number;
}

export interface Department {
    id: string;
    company_id: string;
    name: string;
    description?: string;
    head_user_id?: string;
    created_at: string;
}

export interface DepartmentCreate {
    company_id: string;
    name: string;
    description?: string;
    head_user_id?: string;
}

export interface CompanyVerifyAction {
    approve: boolean;
    rejection_reason?: string;
}