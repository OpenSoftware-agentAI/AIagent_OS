import * as path from "path";

const base = path.join(__dirname, "../../assets"); // 빌드 후 상대경로 조정 필요시 여기만 수정

export const ASSET_PATHS = {
  data: path.join(base, "data.xlsx"),
  explanation: path.join(base, "explanation.txt"),
  endingComment: path.join(base, "endingComment.txt"),
  encouragements: path.join(base, "encouragementsComment.txt"),
};
