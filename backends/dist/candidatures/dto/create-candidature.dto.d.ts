export declare class CreateCandidatureDto {
    id_offre: string;
    nom: string;
    prenom: string;
    email: string;
    status?: 'submitted' | 'pending' | 'accepted' | 'rejected';
}
