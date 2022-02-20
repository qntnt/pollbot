import { PollDTO, PollRequestDTO } from '../idl/v1/polls';
export declare class PollsService {
    private readonly firestore;
    private readonly pollCollection;
    private readonly ballotCollection;
    private readonly guildCollection;
    private readonly counterCollection;
    private readonly pollIdCounterRef;
    private incrementPollId;
    create(pollRequest: PollRequestDTO): Promise<PollDTO>;
    findOne(pollId: string): Promise<PollDTO>;
}
