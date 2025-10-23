import {type MemoryProfileV2, MethodDictionarySlice, type TimeProfileV2} from "~/proto/ProfileFile_pb";

public export interface AirplaneProfileFileV2Data {

    dictionary: MethodDictionarySlice[];

    timeProfile: TimeProfileV2[];

    memoryProfile: MemoryProfileV2[];

}
