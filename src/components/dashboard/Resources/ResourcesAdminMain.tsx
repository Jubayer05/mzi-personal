"use client";

import { Card, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Semester {
  id: string;
  name: string;
  route: string;
}

const semesters: Semester[] = [
  {
    id: "1-1",
    name: "1st Year 1st Semester",
    route: "/dashboard/resources/1-1",
  },
  {
    id: "1-2",
    name: "1st Year 2nd Semester",
    route: "/dashboard/resources/1-2",
  },
  {
    id: "2-1",
    name: "2nd Year 1st Semester",
    route: "/dashboard/resources/2-1",
  },
  {
    id: "2-2",
    name: "2nd Year 2nd Semester",
    route: "/dashboard/resources/2-2",
  },
  {
    id: "3-1",
    name: "3rd Year 1st Semester",
    route: "/dashboard/resources/3-1",
  },
  {
    id: "3-2",
    name: "3rd Year 2nd Semester",
    route: "/dashboard/resources/3-2",
  },
  {
    id: "4-1",
    name: "4th Year 1st Semester",
    route: "/dashboard/resources/4-1",
  },
  {
    id: "4-2",
    name: "4th Year 2nd Semester",
    route: "/dashboard/resources/4-2",
  },
];

const ResourcesAdminMain = () => {
  const router = useRouter();

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Resources Management
      </Title>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {semesters.map((semester) => (
          <Card
            key={semester.id}
            hoverable
            onClick={() => router.push(semester.route)}
            style={{
              minHeight: 120,
              cursor: "pointer",
              border: "1px solid #d9d9d9",
              borderRadius: 8,
              transition: "all 0.3s",
            }}
            styles={{
              body: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
              },
            }}
          >
            <Title level={4} style={{ margin: 0, textAlign: "center" }}>
              {semester.name}
            </Title>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourcesAdminMain;
