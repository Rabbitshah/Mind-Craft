import { useState } from "react";
import { Chip } from "../components/Chip";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  ProgressBar,
  Select,
  Separator,
  TabPanel,
  Tabs,
} from "../components/primitives";
import { Icon } from "../components/Icons";

export function ComponentLibraryPage() {
  const [progress, setProgress] = useState(65);
  const [category, setCategory] = useState("design");
  const [checked, setChecked] = useState(true);

  return (
    <div className="page-section py-12">
      <h1 className="editorial-title text-5xl font-black">MindCraft Component Library</h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--muted-foreground)]">
        This page replaces the generated Radix-based component playground with local
        project primitives that the rest of the app now uses.
      </p>

      <div className="mt-10 space-y-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Buttons</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Inputs & Forms</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="component-email">Email</Label>
              <Input id="component-email" className="mt-2" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="component-select">Select</Label>
              <Select
                className="mt-2 w-full"
                value={category}
                onChange={setCategory}
                options={[
                  { value: "design", label: "Design" },
                  { value: "development", label: "Development" },
                  { value: "craft", label: "Digital Craft" },
                ]}
              />
            </div>
            <Checkbox
              id="component-checkbox"
              checked={checked}
              onChange={setChecked}
              label="Enable notifications and course reminders."
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Badges & Chips</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Chip label="Design" />
            <Chip label="Development" selected />
            <Chip label="Removable" tone="outline" onRemove={() => {}} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Progress</h2>
          <div className="mt-5 max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Course Progress</span>
              <span className="text-sm font-semibold text-[var(--primary)]">
                {progress}%
              </span>
            </div>
            <ProgressBar value={progress} />
            <div className="mt-4 flex gap-3">
              <Button variant="outline" onClick={() => setProgress((value) => Math.max(0, value - 10))}>
                -10%
              </Button>
              <Button onClick={() => setProgress((value) => Math.min(100, value + 10))}>
                +10%
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Tabs</h2>
          <div className="mt-5">
            <Tabs
              tabs={[
                { value: "overview", label: "Overview" },
                { value: "curriculum", label: "Curriculum" },
                { value: "reviews", label: "Reviews" },
              ]}
              defaultTab="overview"
            >
              <TabPanel value="overview">
                <p className="text-[var(--muted-foreground)]">
                  Overview content demonstrates the local tab switcher used across course detail and dashboards.
                </p>
              </TabPanel>
              <TabPanel value="curriculum">
                <p className="text-[var(--muted-foreground)]">Curriculum content lives here.</p>
              </TabPanel>
              <TabPanel value="reviews">
                <p className="text-[var(--muted-foreground)]">Review content lives here.</p>
              </TabPanel>
            </Tabs>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Typography & Color</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h1 className="text-5xl font-black">Editorial Display</h1>
              <Separator className="my-4" />
              <h2 className="text-4xl font-black">Section Heading</h2>
              <Separator className="my-4" />
              <p className="leading-8 text-[var(--muted-foreground)]">
                Body copy is tuned for dense learning content, dashboard summaries, and checkout explanations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Primary", "var(--primary)"],
                ["Secondary", "var(--secondary)"],
                ["Accent", "var(--accent)"],
                ["Success", "var(--success)"],
              ].map(([label, color]) => (
                <div key={label} className="rounded-[1.5rem] border border-[var(--border)] p-4">
                  <div className="h-20 rounded-[1rem]" style={{ backgroundColor: color }} />
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
          <h2 className="text-2xl font-bold">Table Sample</h2>
          <div className="mt-5 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted-foreground)]">
                <tr>
                  <th className="pb-4 pr-4">Course</th>
                  <th className="pb-4 pr-4">Instructor</th>
                  <th className="pb-4 pr-4">Rating</th>
                  <th className="pb-4 pr-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["UI/UX Design Masterclass", "Sarah Chen", "4.9", "$89"],
                  ["Full-Stack Development", "James Martinez", "4.8", "$99"],
                ].map(([course, instructor, rating, price]) => (
                  <tr key={course} className="border-t border-[var(--border)]">
                    <td className="py-4 pr-4 font-semibold">{course}</td>
                    <td className="py-4 pr-4">{instructor}</td>
                    <td className="py-4 pr-4">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="star" className="h-4 w-4 text-[var(--accent)]" />
                        {rating}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-semibold">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
